"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { ApiError } from "@/services/api";
import { productsService, type Product } from "@/services/products.service";

function isVerifiedSeller(status: string | null | undefined): boolean {
  return status === "approved";
}

function sellerInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center text-tertiary-container" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`material-symbols-outlined text-[16px] ${i < Math.round(value) ? "icon-filled" : ""}`}
        >
          star
        </span>
      ))}
    </span>
  );
}

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const current = images[selected] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden aspect-square flex items-center justify-center">
        {current ? (
          <Image
            src={current}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        ) : (
          <span className="flex items-center gap-2 text-caption text-outline">
            <span className="material-symbols-outlined text-[20px]">image</span>
            No image available
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2" role="tablist" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              role="tab"
              aria-selected={selected === i}
              aria-label={`View image ${i + 1}`}
              onClick={() => setSelected(i)}
              className={`relative aspect-square bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm transition-all hover:opacity-90 ${
                selected === i ? "ring-2 ring-primary" : ""
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="25vw" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SellerBanner({ product }: { product: Product }) {
  const name = product.seller?.fullName ?? "Independent maker";
  const verified = isVerifiedSeller(product.seller?.sellerStatus);
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary text-headline-sm shrink-0">
          {sellerInitials(product.seller?.fullName)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-on-surface truncate">{name}</span>
            {verified && (
              <span className="material-symbols-outlined icon-filled text-primary text-[17px] shrink-0">
                check_circle
              </span>
            )}
          </div>
          <p className="text-caption text-outline truncate">
            {verified ? "Verified seller" : "Marketplace seller"}
          </p>
        </div>
      </div>
      {product.freeShipping && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-label-sm shrink-0">
          <span className="material-symbols-outlined text-[15px] text-secondary">local_shipping</span>
          Free shipping
        </span>
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // Remount on id change so product/error/quantity state starts fresh for each listing.
  return <ProductDetail key={id} id={id} />;
}

function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let cancelled = false;

    productsService
      .getById(id)
      .then((res) => {
        if (cancelled) return;
        setProduct(res);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[products]", err);
        const status = err instanceof ApiError ? err.status : undefined;
        if (status === 404) {
          setIsNotFound(true);
          setError(null);
        } else if (status === 400) {
          setError("That request didn't look right. Check your input and try again.");
        } else {
          setError("Something went wrong. Try again.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, retryKey]);

  const retry = () => {
    setError(null);
    setIsNotFound(false);
    setRetryKey((k) => k + 1);
  };
  const inStock = (product?.stock ?? 0) > 0;
  const lowStock = product != null && product.stock > 0 && product.stock <= 5;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-28 lg:pb-16">
      {/* Breadcrumb (desktop) */}
      <nav
        aria-label="Breadcrumb"
        className="hidden lg:flex items-center gap-1 py-4 text-caption text-on-surface-variant overflow-x-auto whitespace-nowrap"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          Explore
        </Link>
        <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
        <span className="text-on-surface font-semibold truncate">
          {product?.name ?? "Loading…"}
        </span>
      </nav>

      {/* Mobile back link */}
      <Link
        href="/products"
        className="lg:hidden inline-flex items-center gap-1 py-3 text-label-sm text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to results
      </Link>

      {!product && !error && !isNotFound ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" aria-label="Loading product">
          <div className="lg:col-span-7">
            <div className="aspect-square rounded-xl bg-surface-container-lowest shadow-sm animate-pulse" />
            <div className="grid grid-cols-4 gap-2 mt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-surface-container-lowest shadow-sm animate-pulse" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
            <div className="h-5 rounded bg-surface-container-low animate-pulse" />
            <div className="h-5 w-2/3 rounded bg-surface-container-low animate-pulse" />
            <div className="h-8 w-1/3 rounded bg-surface-container-low animate-pulse" />
            <div className="h-11 rounded-lg bg-surface-container-low animate-pulse" />
          </div>
        </div>
      ) : !product && (error || isNotFound) ? (
        isNotFound ? (
          <div className="flex flex-col items-center gap-3 bg-surface-container-lowest rounded-xl shadow-sm p-10 text-center max-w-lg mx-auto">
            <span className="material-symbols-outlined text-[32px] text-outline">search_off</span>
            <p className="text-headline-md text-on-surface">Product not found</p>
            <p className="text-body-sm text-on-surface-variant">
              This listing may have been removed or the link is incorrect.
            </p>
            <Link
              href="/products"
              className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 bg-surface-container-lowest rounded-xl shadow-sm p-10 text-center max-w-lg mx-auto">
            <span className="material-symbols-outlined text-[32px] text-outline">error</span>
            <p className="text-headline-md text-on-surface">Something went wrong</p>
            <p className="text-body-sm text-on-surface-variant">{error}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-1 px-4 py-2 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary-container transition-colors"
            >
              Try again
            </button>
          </div>
        )
      ) : product ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <Gallery images={product.images} name={product.name} />
            </div>

            {/* Info + buy box */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  {product.seller && isVerifiedSeller(product.seller.sellerStatus) ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-primary text-label-sm">
                      <span className="material-symbols-outlined icon-filled text-[15px]">
                        verified
                      </span>
                      Verified Seller
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant text-label-sm">
                      {product.category}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm ${
                      inStock ? "bg-success-lightest text-success-foreground" : "bg-error-container text-on-error-container"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {inStock ? (lowStock ? `Only ${product.stock} left` : "In Stock") : "Out of stock"}
                  </span>
                </div>

                <div>
                  <h1 className="text-headline-md lg:text-headline-lg text-on-surface tracking-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Stars value={product.ratingAvg} />
                    <span className="text-label-md text-on-surface">{product.ratingAvg.toFixed(1)}</span>
                    <span className="text-outline text-body-sm">•</span>
                    <span className="text-label-sm text-on-surface-variant">
                      {product.ratingCount} {product.ratingCount === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2.5">
                  <span className="text-headline-lg text-on-surface tracking-tight">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.freeShipping && (
                    <span className="text-caption text-secondary font-medium">Free shipping</span>
                  )}
                </div>

                <div className="h-px bg-surface-container-high w-full" />

                {/* Quantity stepper (visual only) */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-surface-container-low rounded-lg p-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={!inStock}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="text-headline-sm text-on-surface w-10 text-center">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={!inStock}
                      onClick={() => setQuantity((q) => Math.min(product.stock > 0 ? product.stock : 1, q + 1))}
                      className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <span className="text-caption text-outline">
                    {product.stock} available
                  </span>
                </div>

                <button
                  type="button"
                  disabled
                  title="Checkout is coming soon"
                  className="w-full h-11 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  <span>Available soon</span>
                </button>

                <div className="bg-surface-container-low rounded-lg p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                      verified_user
                    </span>
                    <div>
                      <p className="text-label-sm text-on-surface">Buyer Protection</p>
                      <p className="text-caption text-outline">30-day hassle-free returns</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                      local_shipping
                    </span>
                    <div>
                      <p className="text-label-sm text-on-surface">Insured Delivery</p>
                      <p className="text-caption text-outline">
                        {product.freeShipping ? "Free carbon-neutral shipping" : "Tracked shipping at checkout"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <SellerBanner product={product} />

              {product.description && (
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm space-y-2">
                  <h2 className="text-label-md text-on-surface">About this piece</h2>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">{product.description}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 bg-surface-container-low text-on-surface-variant px-2.5 py-1 rounded-full text-label-sm">
                      <span className="material-symbols-outlined text-[15px] text-primary">category</span>
                      {product.category}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky mobile purchase bar */}
          <div className="lg:hidden sticky bottom-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl shadow-card">
            <div className="px-4 py-3 flex items-center gap-3">
              <div className="flex items-center rounded-lg bg-surface-container-low p-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="w-8 text-center text-label-md text-on-surface select-none">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => Math.min(product.stock > 0 ? product.stock : 1, q + 1))}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              <button
                type="button"
                disabled
                title="Checkout is coming soon"
                className="flex-1 h-11 px-4 rounded-lg bg-primary text-on-primary text-label-md flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                <span>Available soon</span>
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
