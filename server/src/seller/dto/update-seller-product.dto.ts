import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from './create-seller-product.dto';

/**
 * Mirrors `PartialType(CreateSellerProductDto)`: every field is optional but keeps
 * its validation rules. `sellerId`, `ratingAvg`, `ratingCount` and `slug` are
 * intentionally absent so `whitelist`/`forbidNonWhitelisted` reject them with 400.
 * `deleted` is excluded from `status` on purpose: removal is the DELETE route's job,
 * and it is the only way a product reaches `deleted` — see `SellerService.softDeleteProduct`.
 * `category` is validated against the same `PRODUCT_CATEGORIES` list as the create DTO
 * so a PATCH can never write a category a POST would have rejected.
 */
export class UpdateSellerProductDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  price?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsIn(PRODUCT_CATEGORIES)
  category?: ProductCategory;

  @IsOptional()
  @IsBoolean()
  freeShipping?: boolean;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
