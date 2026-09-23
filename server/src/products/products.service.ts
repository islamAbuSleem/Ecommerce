import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProductsQueryDto } from './dto/products-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductsQueryDto) {
    try {
      const page = query.page ?? 1;
      const limit = query.limit ?? 12;

      const where: Prisma.ProductWhereInput = { status: 'active' };

      if (query.q) {
        where.OR = [
          { name: { contains: query.q, mode: 'insensitive' } },
          { description: { contains: query.q, mode: 'insensitive' } },
          { seller: { fullName: { contains: query.q, mode: 'insensitive' } } },
        ];
      }
      if (query.category) {
        where.category = query.category;
      }
      if (query.maxPrice !== undefined) {
        where.price = { lte: query.maxPrice };
      }
      if (query.minRating !== undefined) {
        where.ratingAvg = { gte: query.minRating };
      }
      if (query.freeShipping === true) {
        where.freeShipping = true;
      }
      if (query.verifiedSeller === true) {
        where.seller = { sellerStatus: 'approved' };
      }

      let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ createdAt: 'desc' }, { id: 'asc' }];
      switch (query.sort) {
        case 'price-asc':
          orderBy = [{ price: 'asc' }, { id: 'asc' }];
          break;
        case 'price-desc':
          orderBy = [{ price: 'desc' }, { id: 'asc' }];
          break;
        case 'rating':
          orderBy = [{ ratingAvg: 'desc' }, { id: 'asc' }];
          break;
        case 'newest':
        default:
          orderBy = [{ createdAt: 'desc' }, { id: 'asc' }];
          break;
      }

      const [items, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            seller: { select: { id: true, fullName: true, sellerStatus: true } },
          },
        }),
        this.prisma.product.count({ where }),
      ]);

      return { items, total };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findFirst({
        where: { id, status: 'active' },
        include: {
          seller: { select: { id: true, fullName: true, sellerStatus: true } },
        },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch product');
    }
  }
}
