import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import type { Role } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import {
  DEFAULT_SELLER_APPLICATION_STATUS,
  sellerApplicationWhere,
  type SellerApplicationStatus,
} from './dto/seller-applications-query.dto';
import type { ReviewSellerApplicationDto } from './dto/review-seller-application.dto';
import {
  type AdminAnalyticsRange,
  DEFAULT_ADMIN_ANALYTICS_RANGE,
} from './dto/analytics-query.dto';

/**
 * Columns the review queue needs. `products` is not selected here: the queue
 * shows a lifetime `productCount`, which Prisma computes with a subquery rather
 * than shipping every product row to the client.
 */
const APPLICATION_SELECT = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  sellerStatus: true,
  createdAt: true,
  sellerReviewedAt: true,
  sellerReviewNote: true,
  sellerReviewedBy: true,
  _count: { select: { products: true } },
} as const;

/** The subset of a product an admin needs to judge a seller application. */
const APPLICATION_PRODUCT_SELECT = {
  id: true,
  name: true,
  slug: true,
  price: true,
  stock: true,
  status: true,
  category: true,
} as const;

type AdminAccount = {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
};

/**
 * At or below this many units an active SKU is flagged "low stock". Mirrors the
 * seller dashboard's threshold so both views agree; reported back to the client
 * as `lowStock.threshold` rather than letting the frontend hardcode it.
 */
export const PLATFORM_LOW_STOCK_THRESHOLD = 5;

/** `range` query value -> window length in days. `all` has no cutoff. */
const ANALYTICS_WINDOW_DAYS: Record<Exclude<AdminAnalyticsRange, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

/** `all` is not chartable as a daily series, so the trend caps here. */
const ANALYTICS_SERIES_CAP_DAYS = 90;

const TOP_SELLERS_LIMIT = 5;
const LOW_STOCK_ITEMS_LIMIT = 8;

type CategoryGmvRow = { category: string; gmv: number; units: number };
type TopSellerRow = { sellerId: string; name: string | null; gmv: number; orders: number };

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Single source of truth for admin access control, mirroring
   * `SellerService.assertApprovedSeller`. Every admin route calls this first:
   * 403 unless the account is an admin.
   *
   * The check hits the database rather than reading a role off the JWT, so a
   * demoted admin loses access immediately instead of at token expiry.
   */
  async assertAdmin(userId: string): Promise<AdminAccount> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, fullName: true, role: true },
    });

    // A valid JWT for a since-deleted account is unauthenticated, not
    // merely unauthorised — 401 tells the client to re-auth rather than to
    // report a permissions problem.
    if (!user) {
      throw new UnauthorizedException('Account no longer exists');
    }

    if (user.role !== 'admin') {
      throw new ForbiddenException('Admin access denied');
    }

    return user;
  }

  /**
   * The seller review queue.
   *
   * Only users holding the `seller` role appear, since a seller *is* an
   * applicant. Ordered `createdAt` ascending so the oldest application is always
   * first — a FIFO queue, so nobody can be starved by newer signups.
   * `total` counts every row matching the filter, not the returned page.
   */
  async listApplications(
    userId: string,
    status: SellerApplicationStatus = DEFAULT_SELLER_APPLICATION_STATUS,
  ) {
    try {
      await this.assertAdmin(userId);
      const where = sellerApplicationWhere(status);

      const [rows, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          select: APPLICATION_SELECT,
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        }),
        this.prisma.user.count({ where }),
      ]);

      // One extra query resolves every referenced admin name at once, so the
      // response is two round trips regardless of how long the queue is.
      const reviewerNames = await this.reviewerNames(rows);

      return {
        items: rows.map((row) => ({
          id: row.id,
          email: row.email,
          fullName: row.fullName,
          role: row.role,
          sellerStatus: row.sellerStatus,
          createdAt: row.createdAt,
          reviewedAt: row.sellerReviewedAt,
          reviewNote: row.sellerReviewNote,
          reviewedByName: reviewerNames[row.sellerReviewedBy ?? ''] ?? null,
          productCount: row._count.products,
        })),
        total,
      };
    } catch (error) {
      AdminService.rethrow(error, 'Failed to fetch seller applications');
    }
  }

  /**
   * One application in full, including the products the applicant has already
   * listed. A product the applicant published before approval is a signal in its
   * own right, so soft-deleted rows are included here too.
   *
   * 404 when the user does not exist *and* when they are not a seller at all:
   * from the admin console's point of view "no such application" covers both,
   * and it avoids leaking which registered emails are buyers.
   */
  async getApplication(userId: string, id: string) {
    try {
      await this.assertAdmin(userId);

      const application = await this.prisma.user.findFirst({
        where: { id, role: 'seller' },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          sellerStatus: true,
          createdAt: true,
          updatedAt: true,
          sellerReviewedAt: true,
          sellerReviewNote: true,
          sellerReviewedBy: true,
          products: {
            select: APPLICATION_PRODUCT_SELECT,
            orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
          },
        },
      });

      if (!application) {
        throw new NotFoundException('Seller application not found');
      }

      const reviewerNames = await this.reviewerNames([application]);

      return {
        id: application.id,
        email: application.email,
        fullName: application.fullName,
        role: application.role,
        sellerStatus: application.sellerStatus,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
        reviewedAt: application.sellerReviewedAt,
        reviewNote: application.sellerReviewNote,
        reviewedByName:
          reviewerNames[application.sellerReviewedBy ?? ''] ?? null,
        products: application.products,
        // Lifetime count (matches the queue's `productCount`, and includes
        // soft-deleted rows) so the detail header and identity card agree.
        productCount: application.products.length,
      };
    } catch (error) {
      AdminService.rethrow(error, 'Failed to fetch seller application');
    }
  }

  /**
   * Record a review decision.
   *
   * - `approve` → `role = 'seller'`, `sellerStatus = 'approved'`
   * - `decline` → `sellerStatus = 'rejected'`, `role` left untouched (the user is
   *   already a seller applicant; `assertApprovedSeller` blocks anyone who is not
   *   approved, so a declined account stays locked out either way)
   *
   * Re-deciding a resolved application is deliberately allowed — an admin
   * correcting a mistake must be able to flip the verdict, and the new decision
   * overwrites the previous stamp rather than appending to it.
   */
  async reviewApplication(
    userId: string,
    id: string,
    dto: ReviewSellerApplicationDto,
  ) {
    try {
      const admin = await this.assertAdmin(userId);
      await this.assertIsApplication(id);

      const note = dto.note?.trim() ? dto.note.trim() : null;
      // A decline with no reason is not actionable for the applicant, so it is
      // rejected here rather than silently stored as NULL.
      if (dto.decision === 'decline' && !note) {
        throw new BadRequestException(
          'A note is required when declining a seller application',
        );
      }

      const reviewed = await this.prisma.user.update({
        where: { id },
        data: {
          role: 'seller',
          sellerStatus: dto.decision === 'approve' ? 'approved' : 'rejected',
          sellerReviewedAt: new Date(),
          sellerReviewedBy: admin.id,
          sellerReviewNote: note,
        },
        select: {
          id: true,
          role: true,
          sellerStatus: true,
          sellerReviewedAt: true,
          sellerReviewNote: true,
        },
      });

      return {
        id: reviewed.id,
        role: reviewed.role,
        sellerStatus: reviewed.sellerStatus,
        reviewedAt: reviewed.sellerReviewedAt,
        reviewNote: reviewed.sellerReviewNote,
      };
    } catch (error) {
      AdminService.rethrow(error, 'Failed to review seller application');
    }
  }

  /**
   * Platform-wide analytics for the admin dashboard.
   *
   * Every figure is computed from rows that actually exist: `Order`, `Product`
   * and `User`. There is deliberately no commission, take-rate, payout or
   * dispute figure in the response — those would be fiction, since the platform
   * has no commission engine or payments integration yet. The client renders a
   * "not configured" panel in their place.
   */
  async analytics(userId: string, range: AdminAnalyticsRange = DEFAULT_ADMIN_ANALYTICS_RANGE) {
    try {
      await this.assertAdmin(userId);
      const since = AdminService.analyticsRangeStart(range);

      const [agg, approvedSellers, pendingApplications, categories, topSellers, lowStock] =
        await Promise.all([
          this.prisma.order.aggregate({
            where: since ? { createdAt: { gte: since } } : {},
            _sum: { total: true },
            _count: true,
          }),
          this.prisma.user.count({ where: { role: 'seller', sellerStatus: 'approved' } }),
          this.prisma.user.count({ where: { role: 'seller', sellerStatus: 'pending' } }),
          this.categoryGmv(since),
          this.topSellerGmv(since, TOP_SELLERS_LIMIT),
          this.platformLowStock(),
        ]);

      const seriesWindowDays =
        range === 'all' ? ANALYTICS_SERIES_CAP_DAYS : ANALYTICS_WINDOW_DAYS[range];
      const seriesStart = new Date();
      seriesStart.setHours(0, 0, 0, 0);
      seriesStart.setDate(seriesStart.getDate() - (seriesWindowDays - 1));
      const series = await this.ordersOverTime(seriesStart, seriesWindowDays);

      const gmv = Math.round((agg._sum.total ?? 0) * 100) / 100;

      return {
        range,
        kpis: {
          gmv,
          orderCount: agg._count,
          approvedSellers,
          pendingApplications,
        },
        series,
        seriesLabel: range === 'all' ? 'Last 90 days' : `Last ${seriesWindowDays} days`,
        categories,
        topSellers,
        lowStock,
      };
    } catch (error) {
      AdminService.rethrow(error, 'Failed to fetch analytics');
    }
  }

  /** Inclusive lower bound for a date-range, or `null` when the range is `all`. */
  private static analyticsRangeStart(range: AdminAnalyticsRange): Date | null {
    if (range === 'all') return null;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ANALYTICS_WINDOW_DAYS[range]);
    return start;
  }

  /**
   * GMV per category across the window. `items` is a jsonb array of
   * `{ productId, price, qty }` lines, so the join into `Product` for the
   * category runs in Postgres rather than hydrating every order.
   */
  private async categoryGmv(since: Date | null): Promise<CategoryGmvRow[]> {
    const whereSql =
      since === null ? Prisma.empty : Prisma.sql`WHERE o."createdAt" >= ${since}`;
    const rows = await this.prisma.$queryRaw<CategoryGmvRow[]>(
      Prisma.sql`
        SELECT p."category" AS category,
               COALESCE(SUM((line->>'price')::numeric * (line->>'qty')::numeric), 0) AS gmv,
               COALESCE(SUM((line->>'qty')::numeric), 0) AS units
        FROM "Order" o
        CROSS JOIN LATERAL jsonb_array_elements(o."items") AS line
        JOIN "Product" p ON p.id = line->>'productId'
        ${whereSql}
        GROUP BY p."category"
        ORDER BY gmv DESC
      `,
    );
    const total = rows.reduce((sum, row) => sum + Number(row.gmv), 0);
    return rows.map((row) => ({
      category: row.category,
      gmv: Math.round(Number(row.gmv) * 100) / 100,
      units: Number(row.units),
      share: total > 0 ? Math.round((Number(row.gmv) / total) * 100) : 0,
    }));
  }

  /** Top sellers by GMV across the window, resolved to their account name. */
  private async topSellerGmv(since: Date | null, limit: number): Promise<TopSellerRow[]> {
    const whereSql =
      since === null ? Prisma.empty : Prisma.sql`WHERE o."createdAt" >= ${since}`;
    const rows = await this.prisma.$queryRaw<TopSellerRow[]>(
      Prisma.sql`
        SELECT p."sellerId" AS sellerId,
               u."fullName" AS name,
               COALESCE(SUM((line->>'price')::numeric * (line->>'qty')::numeric), 0) AS gmv,
               COUNT(DISTINCT o."id") AS orders
        FROM "Order" o
        CROSS JOIN LATERAL jsonb_array_elements(o."items") AS line
        JOIN "Product" p ON p.id = line->>'productId'
        LEFT JOIN "User" u ON u.id = p."sellerId"
        ${whereSql}
        GROUP BY p."sellerId", u."fullName"
        ORDER BY gmv DESC
        LIMIT ${limit}
      `,
    );
    return rows.map((row) => ({
      sellerId: row.sellerId,
      name: row.name,
      gmv: Math.round(Number(row.gmv) * 100) / 100,
      orders: Number(row.orders),
    }));
  }

  /** Daily orders-over-time series, zero-padded so the chart has contiguous days. */
  private async ordersOverTime(start: Date, days: number): Promise<
    { day: string; orders: number; gmv: number }[]
  > {
    const rows = await this.prisma.$queryRaw<{ day: string; orders: number; gmv: number }[]>(
      Prisma.sql`
        SELECT to_char(date_trunc('day', "createdAt"), 'YYYY-MM-DD') AS day,
               COUNT(*) AS orders,
               COALESCE(SUM("total"), 0) AS gmv
        FROM "Order"
        WHERE "createdAt" >= ${start}
        GROUP BY 1
        ORDER BY 1
      `,
    );
    const byDay = new Map(rows.map((row) => [row.day, row]));
    const series: { day: string; orders: number; gmv: number }[] = [];
    for (let i = 0; i < days; i++) {
      const cursor = new Date(start);
      cursor.setDate(start.getDate() + i);
      const key = AdminService.dayKey(cursor);
      const match = byDay.get(key);
      series.push({
        day: key,
        orders: match ? Number(match.orders) : 0,
        gmv: match ? Math.round(Number(match.gmv) * 100) / 100 : 0,
      });
    }
    return series;
  }

  private static dayKey(date: Date): string {
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-');
  }

  /**
   * Platform low-stock snapshot over active listings. Sold-out rows are reported
   * as their own count rather than mixed into the "low stock" list.
   */
  private async platformLowStock(): Promise<{
    threshold: number;
    count: number;
    outOfStockCount: number;
    items: { id: string; name: string; stock: number; price: number; sellerName: string | null }[];
  }> {
    const threshold = PLATFORM_LOW_STOCK_THRESHOLD;
    const [items, count, outOfStockCount] = await Promise.all([
      this.prisma.product.findMany({
        where: { status: 'active', stock: { gt: 0, lt: threshold } },
        orderBy: [{ stock: 'asc' }, { id: 'asc' }],
        take: LOW_STOCK_ITEMS_LIMIT,
        select: {
          id: true,
          name: true,
          stock: true,
          price: true,
          seller: { select: { fullName: true } },
        },
      }),
      this.prisma.product.count({ where: { status: 'active', stock: { gt: 0, lt: threshold } } }),
      this.prisma.product.count({ where: { status: 'active', stock: 0 } }),
    ]);
    return {
      threshold,
      count,
      outOfStockCount,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        stock: item.stock,
        price: item.price,
        sellerName: item.seller.fullName,
      })),
    };
  }

  /**
   * Guards the `:id` param on both read and write. `findFirst` on a unique `id`
   * cannot race, and it collapses "no such user" and "not a seller" into the one
   * 404 the contract specifies, so PATCH cannot retarget a buyer.
   */
  private async assertIsApplication(id: string): Promise<void> {
    const exists = await this.prisma.user.findFirst({
      where: { id, role: 'seller' },
      select: { id: true },
    });
    if (!exists) {
      throw new NotFoundException('Seller application not found');
    }
  }

  /**
   * Maps each `sellerReviewedBy` id to the reviewing admin's `fullName`.
   * Unknown and null ids collapse to `null` — an admin account deleted after the
   * fact must not blank the history.
   */
  private async reviewerNames(
    rows: { sellerReviewedBy: string | null }[],
  ): Promise<Record<string, string | null>> {
    const ids = [
      ...new Set(
        rows
          .map((row) => row.sellerReviewedBy)
          .filter((value): value is string => value !== null),
      ),
    ];
    if (ids.length === 0) return {};

    const reviewers = await this.prisma.user.findMany({
      where: { id: { in: ids } },
      select: { id: true, fullName: true },
    });
    return Object.fromEntries(
      reviewers.map((reviewer) => [reviewer.id, reviewer.fullName]),
    );
  }

  /**
   * Re-throws anything the global `AllExceptionsFilter` can classify, then wraps
   * the rest — the same contract as `SellerService.rethrow`, so a Prisma error
   * keeps its mapped status instead of becoming an opaque 500.
   */
  private static rethrow(error: unknown, message: string): never {
    if (error instanceof HttpException) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError) throw error;
    throw new InternalServerErrorException(message);
  }
}
