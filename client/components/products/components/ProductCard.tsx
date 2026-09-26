import Link from "next/link";
import { ProductImage } from "./ProductImage";
import { stockSubline } from "./StockBadge";

export type ProductCardProduct = {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  sellerName?: string | null;
  sellerVerified?: boolean;
  status?: "active" | "inactive" | "deleted";
  stock?: number | null;
  ratingAvg?: number | null;
  ratingCount?: number | null;
  freeShipping?: boolean;
};

type Props = {
  product: ProductCardProduct;
  className?: string;
};

export function ProductCard({ product, className = "" }: Props) {
  const detailHref = `/products/${product.id}`;
  const subline = stockSubline(product);

  return (
    <article
      className={`group relative flex flex-col bg-surface-container-lowest rounded-xl p-2.5 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
    >
      <ProductImage product={product} />

      <div className="flex flex-col flex-1 justify-between pt-2">
        <div>
          <div className="flex items-center justify-between gap-1 text-caption text-outline">
            <span className="truncate hover:text-primary transition-colors flex items-center gap-1 min-w-0">
              <span className="truncate">{product.sellerName ?? "Independent maker"}</span>
              {product.sellerVerified && (
                <span className="material-symbols-outlined icon-filled text-primary text-[14px] shrink-0">
                  verified
                </span>
              )}
            </span>
            {product.ratingAvg != null && (
              <span className="flex items-center gap-0.5 text-on-surface text-caption shrink-0">
                <span className="material-symbols-outlined icon-filled text-[13px] text-tertiary-container">
                  star
                </span>
                <span>{product.ratingAvg.toFixed(1)}</span>
                {product.ratingCount != null && (
                  <span className="text-outline">({product.ratingCount})</span>
                )}
              </span>
            )}
          </div>
          <Link href={detailHref}>
            <h3 className="text-body-sm text-on-surface font-semibold line-clamp-2 mt-0.5 leading-snug group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center justify-between pt-2 mt-1">
          <span className="flex flex-col">
            <span className="text-body-lg font-bold text-on-surface leading-none">
              ${product.price.toFixed(2)}
            </span>
            <span className={`text-caption mt-0.5 ${subline.className}`}>{subline.text}</span>
          </span>
          <Link
            href={detailHref}
            aria-label={`View ${product.name}`}
            className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-sm transition-transform active:scale-90 hover:bg-primary-container"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
