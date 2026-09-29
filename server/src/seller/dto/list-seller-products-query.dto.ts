import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

/** Query strings arrive as text; accept `?includeDeleted=true` / `=1` / `=false` / `=0`. */
const toBoolean = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true' || value === '1') return true;
    if (value.toLowerCase() === 'false' || value === '0') return false;
  }
  return value;
};

export class ListSellerProductsQueryDto {
  /**
   * Off by default: soft-deleted products are hidden from the listing and from
   * every catalog count. Set to `true` to surface them (audit / recovery views).
   * A soft-deleted product still cannot be PATCHed back to active — see
   * `SellerService.assertOwnsProduct`.
   */
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  includeDeleted?: boolean;
}
