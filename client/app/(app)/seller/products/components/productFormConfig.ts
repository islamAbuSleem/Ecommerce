import type { SellerProductStatus } from "@/services/seller.service";

export const MAX_IMAGES = 10;
export const MAX_NAME_LENGTH = 80;
export const MIN_NAME_LENGTH = 3;
export const MIN_DESCRIPTION_LENGTH = 20;
export const MAX_DESCRIPTION_LENGTH = 2000;

/** Mirrors `@Min(0.01)` on the backend price field. */
export const MIN_PRICE = 0.01;

/** Mirrors `@ArrayMinSize(1)` on the backend images field. */
export const MIN_IMAGES = 1;

/**
 * The exact six values the backend DTO accepts for `category` — matched by string,
 * so the id and the label are the same. Keep in step with the DTO's category list.
 */
export const PRODUCT_CATEGORIES = [
  { id: "Ceramics", label: "Ceramics", icon: "coffee" },
  { id: "Leather Goods", label: "Leather Goods", icon: "handbag" },
  { id: "Desk Tech", label: "Desk Tech", icon: "devices" },
  { id: "Studio Wood", label: "Studio Wood", icon: "forest" },
  { id: "Fine Jewelry", label: "Fine Jewelry", icon: "diamond" },
  { id: "Woven Textile", label: "Woven Textile", icon: "texture" },
];

export const PRODUCT_CATEGORY_IDS = PRODUCT_CATEGORIES.map((entry) => entry.id);

export const PRODUCT_STATUS_OPTIONS: { id: SellerProductStatus; label: string }[] = [
  { id: "active", label: "Active — visible in the marketplace" },
  { id: "inactive", label: "Inactive — hidden, keeps its data" },
];

export const IMAGE_URL_PATTERN = /^https?:\/\/\S+$/i;
