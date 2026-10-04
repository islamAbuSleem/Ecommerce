import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Platform commission. The rate is a single configurable percentage applied to
 * seller gross; it is computed on the fly for the breakdown today and will be
 * persisted on the order by the Stripe webhook once payments go live.
 */
export const DEFAULT_COMMISSION_RATE = 0.1;

@Injectable()
export class CommissionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  rate(): number {
    const raw = this.config.get<string>('COMMISSION_RATE');
    const parsed = raw ? Number(raw) : DEFAULT_COMMISSION_RATE;
    return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1
      ? parsed
      : DEFAULT_COMMISSION_RATE;
  }

  calculateCommission(amount: number, rate: number = this.rate()): number {
    return Math.round(amount * rate * 100) / 100;
  }

  private async requireSeller(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, sellerStatus: true },
    });
    if (!user) throw new UnauthorizedException('Account no longer exists');
    if (user.role !== 'seller' || user.sellerStatus !== 'approved') {
      throw new ForbiddenException('Seller access denied');
    }
    return user;
  }

  private async requireAdmin(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });
    if (!user) throw new UnauthorizedException('Account no longer exists');
    if (user.role !== 'admin')
      throw new ForbiddenException('Admin access denied');
    return user;
  }

  async sellerEarnings(userId: string) {
    await this.requireSeller(userId);
    const rate = this.rate();
    const rows = await this.prisma.$queryRaw<
      { orders: number; gross: number }[]
    >(
      Prisma.sql`
        SELECT COUNT(DISTINCT o."id") AS orders,
               COALESCE(SUM((line->>'price')::numeric * (line->>'qty')::numeric), 0) AS gross
        FROM "Order" o
        CROSS JOIN LATERAL jsonb_array_elements(o."items") AS line
        JOIN "Product" p ON p.id = line->>'productId'
        WHERE p."sellerId" = ${userId}
      `,
    );
    const gross = Math.round(Number(rows[0]?.gross ?? 0) * 100) / 100;
    const commission = this.calculateCommission(gross, rate);
    return {
      rate,
      orderCount: Number(rows[0]?.orders ?? 0),
      gross,
      commission,
      net: Math.round((gross - commission) * 100) / 100,
    };
  }

  async adminCommissionOverview(userId: string) {
    await this.requireAdmin(userId);
    const rate = this.rate();
    const rows = await this.prisma.$queryRaw<
      { orders: number; gross: number }[]
    >(
      Prisma.sql`
        SELECT COUNT(*) AS orders, COALESCE(SUM("total"), 0) AS gross FROM "Order"
      `,
    );
    const gross = Math.round(Number(rows[0]?.gross ?? 0) * 100) / 100;
    const commission = this.calculateCommission(gross, rate);
    return {
      rate,
      orderCount: Number(rows[0]?.orders ?? 0),
      gross,
      commission,
      net: Math.round((gross - commission) * 100) / 100,
    };
  }
}
