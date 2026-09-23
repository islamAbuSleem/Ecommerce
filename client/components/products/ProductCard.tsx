"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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

function stockChip(stock: number | null | undefined): string | null {
  if (stock == null) return null;
  if (stock <= 0) return "Out of stock";
  if (stock <= 5) return "Low stock";
  return null;
}

function stockChipClass(stock: number | null | undefined): string {
  if (stock == null) return "";
  if (stock <= 0) return "bg-error-container text-on-error-container";
  return "bg-warning text-warning-foreground";
}

function stockSubline(product: ProductCardProduct): { text: string; className: string } {
  if (product.stock != null && product.stock <= 0)
    return { text: "Out of stock", className: "text-outline" };
  if (product.freeShipping) return { text: "Free shipping", className: "text-secondary" };
  if (product.stock == null) return { text: "In stock", className: "text-outline" };
  if (product.stock <= 5) return { text: `Only ${product.stock} left`, className: "text-tertiary" };
  return { text: "In stock", className: "text-outline" };
}

export function ProductCard({ product, className = "" }: Props) {
  const [wishlisted, setWishlisted] = useState(false);
  const detailHref = `/products/${product.id}`;
  const chip = stockChip(product.stock);
  const subline = stockSubline(product);

  return (
    <article
      className={`group relative flex flex-col bg-surface-container-lowest rounded-xl p-2.5 shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
    >
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
        {(chip || product.status) && (
          <div className="absolute top-2 left-2 flex items-center gap-1">
            {chip && (
              <span
                className={`px-2 py-0.5 rounded-full text-caption font-semibold shadow-sm ${stockChipClass(product.stock)}`}
              >
                {chip}
              </span>
            )}
            {product.status && (
              <span
                className={`px-2 py-0.5 rounded-full text-caption font-semibold shadow-sm ${
                  product.status === "active"
                    ? "bg-success-lightest text-success-foreground"
                    : "bg-surface-container-low text-on-surface-variant"
                }`}
              >
                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
              </span>
            )}
          </div>
        )}
        <button
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={wishlisted}
          type="button"
          onClick={() => setWishlisted((v) => !v)}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center shadow-sm active:scale-90 transition-all hover:text-error ${
            wishlisted ? "text-error" : "text-on-surface-variant"
          }`}
        >
          <span
            className={`material-symbols-outlined text-[16px] ${wishlisted ? "icon-filled" : ""}`}
          >
            favorite
          </span>
        </button>
      </div>

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
