import { IsIn, IsOptional } from 'class-validator';

/**
 * Accepted values for `GET /admin/analytics?range=`.
 *
 * - `7d` / `30d` / `90d` — figures whose window is a date range
 * - `all` — no cutoff (all-time totals)
 *
 * Any other value is rejected with 400 by the global `ValidationPipe`.
 */
export const ADMIN_ANALYTICS_RANGES = ['7d', '30d', '90d', 'all'] as const;

export type AdminAnalyticsRange = (typeof ADMIN_ANALYTICS_RANGES)[number];

/** Applied when `range` is omitted, so the endpoint is useful with no query at all. */
export const DEFAULT_ADMIN_ANALYTICS_RANGE: AdminAnalyticsRange = '30d';

export class AdminAnalyticsQueryDto {
  /**
   * Reporting window for the trend, GMV, category split and top-seller figures.
   * The current-state figures (approved-seller / pending-application counts and
   * the low-stock list) are snapshots and ignore the window.
   */
  @IsOptional()
  @IsIn(ADMIN_ANALYTICS_RANGES)
  range?: AdminAnalyticsRange;
}
