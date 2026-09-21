import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  sellerName?: string | null;
  status?: "active" | "inactive" | "deleted";
  stock?: number | null;
};

type Props = {
  product: Product;
  className?: string;
};

const stockBadgeTone = (stock: number | null | undefined): "success" | "warning" | "neutral" => {
  if (stock == null) return "neutral";
  if (stock <= 0) return "neutral";
  if (stock <= 5) return "warning";
  return "success";
};

const stockLabel = (stock: number | null | undefined): string => {
  if (stock == null) return "Unknown";
  if (stock <= 0) return "Out of stock";
  if (stock <= 5) return `Low stock (${stock})`;
  return `In stock (${stock})`;
};

export function ProductCard({ product, className = "" }: Props) {
  return (
    <Card className={`flex flex-col overflow-hidden p-0 ${className}`}>
      <div className="relative h-48 w-full bg-surface-secondary">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted text-sm">
            No image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-text-primary line-clamp-2">{product.name}</h3>
        </div>

        <p className="text-base font-semibold text-text-primary">
          ${product.price.toFixed(2)}
        </p>

        {product.sellerName && (
          <p className="text-xs text-text-secondary">by {product.sellerName}</p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <Badge tone={stockBadgeTone(product.stock)}>{stockLabel(product.stock)}</Badge>
          {product.status && (
            <Badge tone={product.status === "active" ? "success" : "neutral"}>
              {product.status}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
