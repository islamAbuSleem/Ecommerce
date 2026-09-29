"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/components/Icon";
import { ApiError } from "@/services/api";
import type { Product } from "@/services/products.service";
import { sellerService } from "@/services/seller.service";
import { ProductForm } from "../../../components/ProductForm";

export function EditProductView({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    sellerService
      .products()
      .then((list) => {
        if (cancelled) return;
        const match = list.items.find((item) => item.id === id);
        if (match) setProduct(match);
        else setNotFound(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[seller/product-edit]", err);
        const status = err instanceof ApiError ? err.status : undefined;
        if (status === 404) setNotFound(true);
        else setError("We couldn't load that listing. Try again in a moment.");
      });

    return () => {
      cancelled = true;
    };
  }, [id, retryKey]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
        <Icon size="xl" className="text-outline" aria-hidden="true">search_off</Icon>
        <h1 className="text-headline-md text-on-surface">Listing not found</h1>
        <p className="max-w-sm text-body-sm text-on-surface-variant">
          This product is no longer in your catalog, or the link is wrong.
        </p>
        <Link
          href="/seller/dashboard"
          className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
        >
          <Icon size="sm" aria-hidden="true">arrow_back</Icon>
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
        <Icon size="xl" className="text-outline" aria-hidden="true">error</Icon>
        <h1 className="text-headline-md text-on-surface">Something went wrong</h1>
        <p className="max-w-sm text-body-sm text-on-surface-variant">{error}</p>
        <button
          type="button"
          onClick={() => {
            setNotFound(false);
            setError(null);
            setRetryKey((key) => key + 1);
          }}
          className="mt-1 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col gap-4" aria-label="Loading listing" aria-busy="true">
        <div className="h-9 w-1/2 rounded-lg bg-surface-container-lowest animate-pulse" />
        <div className="h-10 w-2/3 rounded-lg bg-surface-container-low animate-pulse" />
        <div className="h-64 rounded-xl bg-surface-container-lowest animate-pulse" />
        <div className="h-72 rounded-xl bg-surface-container-lowest animate-pulse" />
      </div>
    );
  }

  return <ProductForm key={product.id} mode="edit" product={product} />;
}
