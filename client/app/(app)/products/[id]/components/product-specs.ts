import type { Product } from "@/services/products.service";

export function specRows(product: Product): { label: string; value: string }[] {
  return [
    { label: "Category", value: product.category },
    {
      label: "Stock",
      value: product.stock > 0 ? `${product.stock} available` : "Out of stock",
    },
    {
      label: "Shipping",
      value: product.freeShipping ? "Free shipping" : "Tracked shipping at checkout",
    },
    { label: "Seller", value: product.seller?.fullName ?? "Independent maker" },
  ];
}
