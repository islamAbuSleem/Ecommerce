import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { MergeCartDto } from './dto/merge-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  private toTotal(items: { qty: number; product: { price: number } }[]): number {
    const sum = items.reduce((acc, item) => acc + item.product.price * item.qty, 0);
    return Math.round(sum * 100) / 100;
  }

  async getCart(userId: string) {
    try {
      const items = await this.prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: { select: { id: true, name: true, price: true, images: true, stock: true } },
        },
        orderBy: { createdAt: 'asc' },
      });
      const shaped = items.map((item) => ({
        id: item.id,
        qty: item.qty,
        product: item.product,
      }));
      return { items: shaped, total: this.toTotal(items) };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch cart');
    }
  }

  private async assertActiveProduct(productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, status: 'active' },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    try {
      const product = await this.assertActiveProduct(dto.productId);
      if (product.stock <= 0) {
        throw new BadRequestException('Product out of stock');
      }
      const existing = await this.prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId: dto.productId } },
      });
      const requested = existing ? existing.qty + dto.qty : dto.qty;
      if (requested > product.stock) {
        throw new BadRequestException(`Only ${product.stock} items in stock`);
      }
      const qty = Math.min(requested, product.stock);
      if (existing) {
        await this.prisma.cartItem.update({
          where: { id: existing.id },
          data: { qty },
        });
      } else {
        await this.prisma.cartItem.create({
          data: { userId, productId: dto.productId, qty },
        });
      }
      return this.getCart(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to add cart item');
    }
  }

  async updateItem(userId: string, id: string, dto: UpdateCartItemDto) {
    try {
      const existing = await this.prisma.cartItem.findFirst({
        where: { id, userId },
      });
      if (!existing) {
        throw new NotFoundException('Cart item not found');
      }
      const product = await this.assertActiveProduct(existing.productId);
      if (product.stock <= 0) {
        throw new BadRequestException('Product out of stock');
      }
      if (dto.qty > product.stock) {
        throw new BadRequestException(`Only ${product.stock} items in stock`);
      }
      const qty = Math.min(dto.qty, product.stock);
      await this.prisma.cartItem.update({
        where: { id },
        data: { qty },
      });
      return this.getCart(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update cart item');
    }
  }

  async removeItem(userId: string, id: string) {
    try {
      const existing = await this.prisma.cartItem.findFirst({
        where: { id, userId },
      });
      if (!existing) {
        throw new NotFoundException('Cart item not found');
      }
      await this.prisma.cartItem.delete({ where: { id } });
      return this.getCart(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to remove cart item');
    }
  }

  async merge(userId: string, dto: MergeCartDto) {
    try {
      for (const item of dto.items) {
        const product = await this.prisma.product.findFirst({
          where: { id: item.productId, status: 'active' },
        });
        if (!product) {
          continue;
        }
        if (product.stock <= 0) {
          throw new BadRequestException(`Product ${product.name} out of stock`);
        }
        const existing = await this.prisma.cartItem.findUnique({
          where: { userId_productId: { userId, productId: item.productId } },
        });
        const requested = existing ? existing.qty + item.qty : item.qty;
        if (requested > product.stock) {
          throw new BadRequestException(`Only ${product.stock} items in stock for ${product.name}`);
        }
        const qty = Math.min(requested, product.stock);
        if (existing) {
          await this.prisma.cartItem.update({
            where: { id: existing.id },
            data: { qty },
          });
        } else {
          await this.prisma.cartItem.create({
            data: { userId, productId: item.productId, qty },
          });
        }
      }
      return this.getCart(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to merge cart');
    }
  }

  async clear(userId: string) {
    try {
      await this.prisma.cartItem.deleteMany({ where: { userId } });
      return { items: [], total: 0 };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to clear cart');
    }
  }
}
