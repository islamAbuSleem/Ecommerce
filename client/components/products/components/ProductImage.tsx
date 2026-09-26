import Link from "next/link";
import Image from "next/image";
import type { ProductCardProduct } from "./ProductCard";
import { StockBadge, stockChip } from "./StockBadge";
import { StatusBadge } from "./StatusBadge";
import { WishlistButton } from "./WishlistButton";

export function ProductImage({ product }: { product: ProductCardProduct }) {
  const detailHref = `/products/${product.id}`;

  return (
    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-low flex items-center justify-center">
      <Link href={detailHref} aria-label={product.name} className="absolute inset-0">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-caption text-outline">
            No image
          </span>
        )}
      </Link>
      {(stockChip(product.stock) || product.status) && (
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <StockBadge stock={product.stock} />
          {product.status && <StatusBadge status={product.status} />}
        </div>
      )}
      <WishlistButton />
    </div>
  );
}
