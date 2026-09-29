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

/**
 * The six studio collections a product may belong to. Exported as the single
 * source of truth: the API validates against it and the frontend category
 * dropdown renders from the same array, so the two can never drift.
 */
export const PRODUCT_CATEGORIES = [
  'Ceramics',
  'Leather Goods',
  'Desk Tech',
  'Studio Wood',
  'Fine Jewelry',
  'Woven Textile',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export class CreateSellerProductDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images: string[];

  @IsInt()
  @Min(0)
  stock: number;

  @IsIn(PRODUCT_CATEGORIES)
  category: ProductCategory;

  @IsBoolean()
  freeShipping: boolean;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
