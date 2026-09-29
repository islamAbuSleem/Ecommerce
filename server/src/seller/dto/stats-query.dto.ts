import { IsIn, IsOptional } from 'class-validator';

/**
 * Accepted values for `GET /seller/stats?range=`.
 *
 * - `7d`  — orders created in the last 7 days
 * - `30d` — last 30 days
 * - `90d` — last 90 days
 * - `all` — no cutoff (default)
 *
 * Any other value is rejected with 400 by the global `ValidationPipe`.
 */
export const SELLER_STATS_RANGES = ['7d', '30d', '90d', 'all'] as const;

export type SellerStatsRange = (typeof SELLER_STATS_RANGES)[number];

/** Applied when `range` is omitted, so the endpoint is useful with no query at all. */
export const DEFAULT_SELLER_STATS_RANGE: SellerStatsRange = 'all';

export class SellerStatsQueryDto {
  /**
   * Reporting window. Restricts `gmv` and `orderCount` to orders whose
   * `createdAt` falls inside the window. Catalog figures (`skuCount`,
   * `activeSkuCount`, `inStockSkuCount`, `lowStockCount`, `outOfStockCount`,
   * `lowStockItems`) are current-state snapshots and ignore the window.
   */
  @IsOptional()
  @IsIn(SELLER_STATS_RANGES)
  range?: SellerStatsRange;
}
