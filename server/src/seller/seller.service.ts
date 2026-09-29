import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, randomUUID } from 'node:crypto';
import { Prisma } from '../../generated/prisma/client';
import type { Role, SellerStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSellerProductDto } from './dto/create-seller-product.dto';
import { UpdateSellerProductDto } from './dto/update-seller-product.dto';
import {
  DEFAULT_SELLER_STATS_RANGE,
  type SellerStatsRange,
} from './dto/stats-query.dto';

/**
 * At or below this many units an active SKU is flagged "low stock".
 * Exported and echoed back as `lowStockThreshold` on the stats payload so the
 * frontend never hardcodes its own copy of the number.
 */
export const LOW_STOCK_THRESHOLD = 5;

const SELLER_ORDERS_LIMIT = 50;
const LOW_STOCK_ITEMS_LIMIT = 10;

/** `range` query value -> window length in days. `all` has no cutoff. */
const RANGE_WINDOW_DAYS: Record<Exclude<SellerStatsRange, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

/**
 * Every order status the marketplace can persist (`Order.status` is free-form
 * text, but these are the values the order pipeline writes). Seeded into
 * `statusCounts` at zero so the client can render a stable set of pills.
 */
export const SELLER_ORDER_STATUSES = [
  'pending',
  'paid',
  'confirmed',
  'processing',
  'packed',
  'shipped',
  'in_transit',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'canceled',
  'refunded',
] as const;

const SELLER_INCLUDE = {
  seller: { select: { id: true, fullName: true, sellerStatus: true } },
} as const;

type SellerAccount = {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  sellerStatus: SellerStatus | null;
};

/** Row as returned by the raw seller-order query (column names preserved). */
type RawOrderRow = {
  id: string;
  createdAt: Date;
  status: string;
  items: unknown;
};

type OrderLine = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

/**
 * A seller-scoped view of one order. `subtotal` is the sum of *this seller's*
 * lines only — never `Order.total`, which includes other sellers' items and the
 * shipping charge. Shipping is deliberately not apportioned: it is a per-order
 * cost that cannot be split without knowing the buyer's checkout basket split.
 */
type ProjectedOrder = {
  id: string;
  createdAt: Date;
  subtotal: number;
  status: string;
  itemCount: number;
  items: OrderLine[];
};

@Injectable()
export class SellerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Single source of truth for seller access control. Every seller route calls this
   * first: 403 unless the account is a seller, 400 unless the seller is approved.
   */
  async assertApprovedSeller(userId: string): Promise<SellerAccount> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        sellerStatus: true,
      },
    });

    if (!user || user.role !== 'seller') {
      throw new ForbiddenException('Seller access denied');
    }
    if (user.sellerStatus !== 'approved') {
      throw new BadRequestException('Seller profile is not approved yet');
    }

    return user;
  }

  /**
   * Dashboard totals for one seller.
   *
   * `range` narrows the money/order figures to orders created inside the window
   * (the cutoff is pushed into SQL, not filtered in memory). Catalog figures are
   * current-state snapshots and ignore the window.
   */
  async getStats(
    userId: string,
    range: SellerStatsRange = DEFAULT_SELLER_STATS_RANGE,
  ) {
    try {
      const seller = await this.assertApprovedSeller(userId);
      const rangeStart = SellerService.rangeStart(range);
      const since = rangeStart ?? null;

      // Owned products *including* deleted ones: an order placed before a product
      // was soft-deleted still counts toward this seller's GMV.
      const ownedWhere: Prisma.ProductWhereInput = { sellerId: seller.id };
      // Everything the catalog figures count. `skuCount` is "products the seller
      // still has", so soft-deleted rows are excluded from all of them.
      const listedWhere: Prisma.ProductWhereInput = {
        sellerId: seller.id,
        status: { not: 'deleted' },
      };
      const activeWhere: Prisma.ProductWhereInput = {
        sellerId: seller.id,
        status: 'active',
      };
      // Count and list the same set, so the badge number always describes the rows shown.
      const lowStockWhere: Prisma.ProductWhereInput = {
        ...activeWhere,
        stock: { gte: 1, lte: LOW_STOCK_THRESHOLD },
      };

      const products = await this.prisma.product.findMany({
        where: ownedWhere,
        select: { id: true },
      });
      const productIds = products.map((product) => product.id);
      const productIdSet = new Set(productIds);

      const [
        skuCount,
        activeSkuCount,
        inStockSkuCount,
        lowStockCount,
        outOfStockCount,
        lowStockItems,
        orderRows,
      ] = await Promise.all([
        this.prisma.product.count({ where: listedWhere }),
        this.prisma.product.count({ where: activeWhere }),
        this.prisma.product.count({
          where: { ...activeWhere, stock: { gt: 0 } },
        }),
        this.prisma.product.count({ where: lowStockWhere }),
        this.prisma.product.count({
          where: { ...activeWhere, stock: { equals: 0 } },
        }),
        this.prisma.product.findMany({
          where: lowStockWhere,
          orderBy: [{ stock: 'asc' }, { createdAt: 'asc' }],
          take: LOW_STOCK_ITEMS_LIMIT,
          select: {
            id: true,
            name: true,
            stock: true,
            price: true,
            slug: true,
          },
        }),
        this.findSellerOrderRows(productIds, since),
      ]);

      return {
        range,
        rangeStart: rangeStart ? rangeStart.toISOString() : null,
        gmv: this.sumGmv(orderRows, productIdSet),
        orderCount: orderRows.length,
        skuCount,
        activeSkuCount,
        inStockSkuCount,
        lowStockCount,
        lowStockThreshold: LOW_STOCK_THRESHOLD,
        outOfStockCount,
        lowStockItems,
      };
    } catch (error) {
      SellerService.rethrow(error, 'Failed to fetch seller stats');
    }
  }

  async listProducts(userId: string, includeDeleted = false) {
    try {
      const seller = await this.assertApprovedSeller(userId);
      const where: Prisma.ProductWhereInput = includeDeleted
        ? { sellerId: seller.id }
        : { sellerId: seller.id, status: { not: 'deleted' } };

      const [items, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          include: SELLER_INCLUDE,
          orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
        }),
        this.prisma.product.count({ where }),
      ]);

      return { items, total };
    } catch (error) {
      SellerService.rethrow(error, 'Failed to fetch seller products');
    }
  }

  async createProduct(userId: string, dto: CreateSellerProductDto) {
    try {
      const seller = await this.assertApprovedSeller(userId);
      const slug = await this.buildUniqueSlug(dto.name);

      return await this.prisma.product.create({
        data: {
          name: dto.name,
          slug,
          description: dto.description,
          price: dto.price,
          images: dto.images,
          stock: dto.stock,
          category: dto.category,
          freeShipping: dto.freeShipping,
          status: dto.status ?? 'active',
          ratingAvg: 0,
          ratingCount: 0,
          sellerId: seller.id,
        },
        include: SELLER_INCLUDE,
      });
    } catch (error) {
      SellerService.rethrow(error, 'Failed to create product');
    }
  }

  async updateProduct(userId: string, id: string, dto: UpdateSellerProductDto) {
    try {
      const seller = await this.assertApprovedSeller(userId);
      // Soft-deleted products stay deleted: PATCH must not resurrect them.
      await this.assertOwnsProduct(id, seller.id);

      const data: Prisma.ProductUpdateInput = {};
      if (dto.name !== undefined) data.name = dto.name;
      if (dto.description !== undefined) data.description = dto.description;
      if (dto.price !== undefined) data.price = dto.price;
      if (dto.images !== undefined) data.images = dto.images;
      if (dto.stock !== undefined) data.stock = dto.stock;
      if (dto.category !== undefined) data.category = dto.category;
      if (dto.freeShipping !== undefined) data.freeShipping = dto.freeShipping;
      if (dto.status !== undefined) data.status = dto.status;

      return await this.prisma.product.update({
        where: { id },
        data,
        include: SELLER_INCLUDE,
      });
    } catch (error) {
      SellerService.rethrow(error, 'Failed to update product');
    }
  }

  async softDeleteProduct(userId: string, id: string) {
    try {
      const seller = await this.assertApprovedSeller(userId);
      await this.assertOwnsProduct(id, seller.id, { includeDeleted: true });

      await this.prisma.product.update({
        where: { id },
        data: { status: 'deleted' },
      });

      return { id };
    } catch (error) {
      SellerService.rethrow(error, 'Failed to delete product');
    }
  }

  async listOrders(userId: string) {
    try {
      const seller = await this.assertApprovedSeller(userId);
      const productIds = (
        await this.prisma.product.findMany({
          where: { sellerId: seller.id },
          select: { id: true },
        })
      ).map((product) => product.id);

      const rows = await this.findSellerOrderRows(productIds);
      const items = this.projectOrders(
        rows.slice(0, SELLER_ORDERS_LIMIT),
        new Set(productIds),
      );

      return {
        items,
        total: rows.length,
        // Counted over *all* of the seller's orders, not the truncated page, so
        // per-status badges stay honest no matter how many rows are returned.
        statusCounts: SellerService.countByStatus(rows),
      };
    } catch (error) {
      SellerService.rethrow(error, 'Failed to fetch seller orders');
    }
  }

  private async assertOwnsProduct(
    id: string,
    sellerId: string,
    options: { includeDeleted?: boolean } = {},
  ) {
    const owned = await this.prisma.product.findFirst({
      where: {
        id,
        sellerId,
        ...(options.includeDeleted ? {} : { status: { not: 'deleted' } }),
      },
      select: { id: true },
    });
    if (!owned) {
      throw new NotFoundException('Product not found');
    }
  }

  /** Inclusive lower bound for `range`, or `null` when the range is `all`. */
  private static rangeStart(range: SellerStatsRange): Date | null {
    if (range === 'all') return null;
    const start = new Date();
    start.setDate(start.getDate() - RANGE_WINDOW_DAYS[range]);
    return start;
  }

  /**
   * Re-throws anything the global `AllExceptionsFilter` can classify, then wraps
   * the rest. Prisma's `PrismaClientKnownRequestError` carries the codes the
   * filter maps to real HTTP statuses (P2002 -> 409 conflict, P2025 -> 404 not
   * found); swallowing it here would flatten a duplicate slug or a missing row
   * into an opaque 500.
   */
  private static rethrow(error: unknown, message: string): never {
    if (error instanceof HttpException) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;
    throw new InternalServerErrorException(message);
  }

  /**
   * Per-status order counts over the seller's entire order history. Known
   * statuses are always present (0 when unused) so the client can render a
   * fixed set of pills; an unrecognised status is added rather than dropped.
   */
  private static countByStatus(rows: RawOrderRow[]): Record<string, number> {
    const counts = Object.fromEntries(
      SELLER_ORDER_STATUSES.map((status) => [status, 0]),
    ) as Record<string, number>;

    for (const row of rows) {
      const status = row.status.trim().toLowerCase();
      counts[status] = (counts[status] ?? 0) + 1;
    }
    return counts;
  }

  /**
   * Order rows whose `items` snapshot contains at least one of the seller's products.
   * `items` is a jsonb array of `{ productId, name, qty, price }` lines, so the filter
   * runs in Postgres rather than pulling every order into memory.
   *
   * `Order.total` is deliberately not selected: it is the whole basket including
   * other sellers' lines and shipping, so it must never reach a seller-scoped payload.
   */
  private async findSellerOrderRows(
    productIds: string[],
    since: Date | null = null,
  ): Promise<RawOrderRow[]> {
    if (productIds.length === 0) {
      return [];
    }

    return await this.prisma.$queryRaw<RawOrderRow[]>(Prisma.sql`
      SELECT o."id", o."createdAt", o."status", o."items"
      FROM "Order" o
      WHERE EXISTS (
        SELECT 1
        FROM jsonb_array_elements(o."items") AS line
        WHERE line->>'productId' = ANY(${productIds}::text[])
      )
      ${since === null ? Prisma.empty : Prisma.sql`AND o."createdAt" >= ${since}`}
      ORDER BY o."createdAt" DESC, o."id" DESC
    `);
  }

  private toOrderLine(value: unknown): OrderLine | null {
    if (typeof value !== 'object' || value === null) return null;
    const line = value as Record<string, unknown>;
    if (typeof line.productId !== 'string') return null;

    return {
      productId: line.productId,
      name: typeof line.name === 'string' ? line.name : '',
      qty: typeof line.qty === 'number' ? line.qty : 0,
      price: typeof line.price === 'number' ? line.price : 0,
    };
  }

  private sellerLines(
    row: RawOrderRow,
    productIdSet: Set<string>,
  ): OrderLine[] {
    const items = Array.isArray(row.items) ? row.items : [];
    return items
      .map((entry) => this.toOrderLine(entry))
      .filter(
        (line): line is OrderLine =>
          line !== null && productIdSet.has(line.productId),
      );
  }

  /** This seller's slice of one order's line items. Shipping is not apportioned. */
  private sellerSubtotal(lines: OrderLine[]): number {
    const raw = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    return Math.round(raw * 100) / 100;
  }

  private projectOrders(
    rows: RawOrderRow[],
    productIdSet: Set<string>,
  ): ProjectedOrder[] {
    return rows.map((row) => {
      const items = this.sellerLines(row, productIdSet);
      return {
        id: row.id,
        createdAt: row.createdAt,
        subtotal: this.sellerSubtotal(items),
        status: row.status,
        itemCount: items.length,
        items,
      };
    });
  }

  private sumGmv(rows: RawOrderRow[], productIdSet: Set<string>): number {
    let gmv = 0;
    for (const row of rows) {
      for (const line of this.sellerLines(row, productIdSet)) {
        gmv += line.price * line.qty;
      }
    }
    return Math.round(gmv * 100) / 100;
  }

  private async buildUniqueSlug(name: string): Promise<string> {
    const base =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || 'product';

    const isTaken = async (slug: string) =>
      (await this.prisma.product.findUnique({
        where: { slug },
        select: { id: true },
      })) !== null;

    if (!(await isTaken(base))) return base;

    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = `${base}-${randomBytes(3).toString('hex')}`;
      if (!(await isTaken(candidate))) return candidate;
    }

    return `${base}-${randomUUID()}`;
  }
}
