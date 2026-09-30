import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Accepted values for `PATCH /admin/seller-applications/:id` `decision`.
 *
 * - `approve` — grants the seller role with `sellerStatus = 'approved'`
 * - `decline` — sets `sellerStatus = 'rejected'` and requires a `note`
 */
export const SELLER_REVIEW_DECISIONS = ['approve', 'decline'] as const;

export type SellerReviewDecision = (typeof SELLER_REVIEW_DECISIONS)[number];

/** Longest note an admin can leave. Matches the `sellerReviewNote` TEXT column budget. */
export const SELLER_REVIEW_NOTE_MAX_LENGTH = 1000;

export class ReviewSellerApplicationDto {
  /** The verdict. Re-deciding an already-resolved application is allowed. */
  @IsIn(SELLER_REVIEW_DECISIONS)
  decision: SellerReviewDecision;

  /**
   * Free-text reason stored on `sellerReviewNote`.
   *
   * Optional for `approve`, required for `decline`. The requirement is enforced
   * in `AdminService.reviewApplication` rather than here, because it is
   * conditional on `decision` and `class-validator` has no built-in
   * "required when another field equals X" rule.
   */
  @IsOptional()
  @IsString()
  @MaxLength(SELLER_REVIEW_NOTE_MAX_LENGTH)
  note?: string;
}
