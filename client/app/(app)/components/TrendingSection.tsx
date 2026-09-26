import Link from "next/link";
import { ProductCard } from "@/components/products/components/ProductCard";
import { isVerifiedSeller } from "@/components/products/sellers";
import type { Product } from "@/services/products.service";

// Text-only pills (no emojis). Labels map to client-side filters over the
// top-rated feed so they stay functional without new BE query params.
export const TRENDING_PILLS: { id: string; label: string }[] = [
  { id: "all", label: "All Works" },
  { id: "verified", label: "Verified Sellers" },
  { id: "top-rated", label: "Top Rated 4.8+" },
  { id: "shipping", label: "Free Shipping" },
];

type Props = {
  products: Product[];
  loading: boolean;
  error: string | null;
  activePill: string;
  onPillChange: (id: string) => void;
  onRetry: () => void;
};

export function TrendingSection({ products, loading, error, activePill, onPillChange, onRetry }: Props) {
  return (
    <section aria-label="Trending artisanal works" className="w-full py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
            <span className="text-label-sm font-semibold tracking-wider text-secondary uppercase">
              Verified Provenance Catalog
            </span>
          </div>
          <h2 className="text-headline-lg text-on-surface">Trending Artisanal Works</h2>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {TRENDING_PILLS.map(({ id, label }) => {
            const active = activePill === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onPillChange(id)}
                aria-pressed={active}
                className={`rounded-full px-4 py-1.5 text-label-sm whitespace-nowrap transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-label="Loading trending">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-xl bg-surface-container-lowest p-2.5 shadow-sm">
              <div className="aspect-square w-full animate-pulse rounded-lg bg-surface-container-low" />
              <div className="space-y-2 pt-2">
                <div className="h-3 animate-pulse rounded bg-surface-container-low" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-surface-container-low" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-surface-container-low" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
          <span className="material-symbols-outlined text-[32px] text-outline">error</span>
          <p className="text-headline-sm text-on-surface">Could not load trending works</p>
          <p className="text-body-sm text-on-surface-variant">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
          >
            Try again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
          <span className="material-symbols-outlined text-[32px] text-outline">search_off</span>
          <p className="text-headline-sm text-on-surface">No trending works for this filter</p>
          <p className="text-body-sm text-on-surface-variant">Try a different filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0] ?? null,
                sellerName: product.seller?.fullName ?? null,
                sellerVerified: isVerifiedSeller(product.seller?.sellerStatus),
                status: product.status,
                stock: product.stock,
                ratingAvg: product.ratingAvg,
                ratingCount: product.ratingCount,
                freeShipping: product.freeShipping,
              }}
            />
          ))}
        </div>
      )}
      <div className="mt-6 flex justify-center">
        <Link
          href="/products?sort=rating"
          className="inline-flex items-center gap-2 rounded-lg bg-surface-container-lowest px-5 py-2.5 text-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container"
        >
          <span>View all trending</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
