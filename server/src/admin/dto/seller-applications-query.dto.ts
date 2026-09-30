import { IsIn, IsOptional } from 'class-validator';
import type { SellerStatus } from '../../../generated/prisma/enums';

/**
 * Accepted values for `GET /admin/seller-applications?status=`.
 *
 * - `pending`  — applications awaiting a decision (default)
 * - `approved` — sellers who were approved
 * - `rejected` — sellers who were declined
 * - `all`      — every user who has ever been a seller/applicant
 *
 * Any other value is rejected with 400 by the global `ValidationPipe`.
 */
export const SELLER_APPLICATION_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'all',
] as const;

export type SellerApplicationStatus =
  (typeof SELLER_APPLICATION_STATUSES)[number];

/** Applied when `status` is omitted, so the queue shows the pending work by default. */
export const DEFAULT_SELLER_APPLICATION_STATUS: SellerApplicationStatus =
  'pending';

export class SellerApplicationsQueryDto {
  /**
   * Review-queue filter. `all` widens the list to every seller-role user
   * regardless of decision; the other three match `User.sellerStatus` exactly.
   */
  @IsOptional()
  @IsIn(SELLER_APPLICATION_STATUSES)
  status?: SellerApplicationStatus;
}

/**
 * The set of users a review queue can show: anyone holding the `seller` role.
 * A user is an applicant precisely by being a seller with a `sellerStatus`,
 * so the role predicate is always applied and `status` only narrows further.
 */
export function sellerApplicationWhere(status: SellerApplicationStatus): {
  role: 'seller';
  sellerStatus?: SellerStatus;
} {
  if (status === 'all') return { role: 'seller' };
  return { role: 'seller', sellerStatus: status };
}
