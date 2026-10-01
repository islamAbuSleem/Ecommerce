import type { ProductSort } from "@/services/products.service";

export const SEARCH_SORT_OPTIONS: { id: ProductSort; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

export const SEARCH_CATEGORIES: string[] = [
  "Ceramics",
  "Leather Goods",
  "Desk Tech",
  "Studio Wood",
  "Fine Jewelry",
  "Woven Textile",
];
