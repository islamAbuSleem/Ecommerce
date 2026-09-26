import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  private static readonly DELIVERY_PRICES: Record<string, number> = {
    standard: 0,
    express: 12,
  };

  async create(userId: string, dto: CreateOrderDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
          where: { userId },
          include: {
            product: { select: { id: true, name: true, price: true, images: true, stock: true } },
          },
          orderBy: { createdAt: 'asc' },
        });
        if (cartItems.length === 0) {
          throw new BadRequestException('Cart is empty');
        }
        for (const item of cartItems) {
          if (item.product.stock <= 0) {
            throw new BadRequestException(`Product ${item.product.name} out of stock`);
          }
          if (item.qty > item.product.stock) {
            throw new BadRequestException(`Only ${item.product.stock} items in stock for ${item.product.name}`);
          }
        }
        const items = cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          qty: item.qty,
        }));
        const rawSubtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
        const subtotal = Math.round(rawSubtotal * 100) / 100;
        const shippingCost = OrdersService.DELIVERY_PRICES[dto.deliveryMethod] ?? 0;
        const total = Math.round((subtotal + shippingCost) * 100) / 100;
        const order = await tx.order.create({
          data: {
            userId,
            items,
            subtotal,
            shippingCost,
            total,
            fullName: dto.fullName,
            address: dto.address,
            city: dto.city,
            zip: dto.zip,
            country: dto.country,
            deliveryMethod: dto.deliveryMethod,
          },
        });
        for (const item of cartItems) {
          await tx.product.update({
            where: { id: item.product.id },
            data: { stock: { decrement: item.qty } },
          });
        }
        await tx.cartItem.deleteMany({ where: { userId } });
        return order;
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create order');
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const order = await this.prisma.order.findFirst({
        where: { id, userId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      return order;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch order');
    }
  }
}
