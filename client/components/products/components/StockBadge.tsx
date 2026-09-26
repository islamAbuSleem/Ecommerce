export function stockChip(stock: number | null | undefined): string | null {
  if (stock == null) return null;
  if (stock <= 0) return "Out of stock";
  if (stock <= 5) return "Low stock";
  return null;
}

export function stockChipClass(stock: number | null | undefined): string {
  if (stock == null) return "";
  if (stock <= 0) return "bg-error-container text-on-error-container";
  return "bg-warning text-warning-foreground";
}

export function stockSubline(product: { stock?: number | null; freeShipping?: boolean }): {
  text: string;
  className: string;
} {
  if (product.stock != null && product.stock <= 0)
    return { text: "Out of stock", className: "text-outline" };
  if (product.freeShipping) return { text: "Free shipping", className: "text-secondary" };
  if (product.stock == null) return { text: "In stock", className: "text-outline" };
  if (product.stock <= 5) return { text: `Only ${product.stock} left`, className: "text-tertiary" };
  return { text: "In stock", className: "text-outline" };
}

export function StockBadge({ stock }: { stock: number | null | undefined }) {
  const chip = stockChip(stock);
  if (!chip) return null;

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-caption font-semibold shadow-sm ${stockChipClass(stock)}`}
    >
      {chip}
    </span>
  );
}
