"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/products/components/ProductCard";
import { isVerifiedSeller } from "@/components/products/sellers";
import { Input } from "@/components/ui/components/Input";
import { SkeletonGrid } from "../../products/components/SkeletonGrid";
import { Pagination } from "../../products/components/Pagination";
import { Icon } from "@/components/ui/components/Icon";
import { ApiError } from "@/services/api";
import {
  productsService,
  type Product,
  type ProductSort,
} from "@/services/products.service";
import { SEARCH_CATEGORIES, SEARCH_SORT_OPTIONS } from "./searchConfig";

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

type Sort = ProductSort;

type FilterState = {
  q: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  freeShipping: boolean;
  verifiedSeller: boolean;
  sort: Sort;
  page: number;
};

function readInitial(sp: URLSearchParams): FilterState {
  const sort = sp.get("sort");
  return {
    q: sp.get("q") ?? "",
    category: sp.get("category") ?? "",
    minPrice: sp.get("minPrice") ?? "",
    maxPrice: sp.get("maxPrice") ?? "",
    inStock: sp.get("inStock") === "true",
    freeShipping: sp.get("freeShipping") === "true",
    verifiedSeller: sp.get("verifiedSeller") === "true",
    sort: (SEARCH_SORT_OPTIONS.some((option) => option.id === sort) ? sort : "newest") as Sort,
    page: Math.max(1, Number(sp.get("page")) || 1),
  };
}

function buildQuery(f: Omit<FilterState, "q"> & { q: string }): string {
  const params = new URLSearchParams();
  if (f.q.trim()) params.set("q", f.q.trim());
  if (f.category) params.set("category", f.category);
  if (f.minPrice) params.set("minPrice", f.minPrice);
  if (f.maxPrice) params.set("maxPrice", f.maxPrice);
  if (f.inStock) params.set("inStock", "true");
  if (f.freeShipping) params.set("freeShipping", "true");
  if (f.verifiedSeller) params.set("verifiedSeller", "true");
  if (f.sort !== "newest") params.set("sort", f.sort);
  if (f.page > 1) params.set("page", String(f.page));
  return params.toString();
}

export function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(() => readInitial(searchParams).q);
  const [debouncedQ, setDebouncedQ] = useState(() => readInitial(searchParams).q.trim());
  const [category, setCategory] = useState(() => readInitial(searchParams).category);
  const [minPrice, setMinPrice] = useState(() => readInitial(searchParams).minPrice);
  const [maxPrice, setMaxPrice] = useState(() => readInitial(searchParams).maxPrice);
  const [inStock, setInStock] = useState(() => readInitial(searchParams).inStock);
  const [freeShipping, setFreeShipping] = useState(() => readInitial(searchParams).freeShipping);
  const [verifiedSeller, setVerifiedSeller] = useState(() => readInitial(searchParams).verifiedSeller);
  const [sort, setSort] = useState<Sort>(() => readInitial(searchParams).sort);
  const [page, setPage] = useState(() => readInitial(searchParams).page);
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
      setLoading(true);
      setError(null);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    let cancelled = false;

    productsService
      .list({
        q: debouncedQ || undefined,
        category: category || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        inStock: inStock || undefined,
        freeShipping: freeShipping || undefined,
        verifiedSeller: verifiedSeller || undefined,
        sort,
        page,
        limit: PAGE_SIZE,
      })
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setTotal(res.total);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[search]", err);
        const status = err instanceof ApiError ? err.status : undefined;
        setError(
          status === 400
            ? "Those filters didn't work. Try clearing them and try again."
            : "Something went wrong. Try again.",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQ, category, minPrice, maxPrice, inStock, freeShipping, verifiedSeller, sort, page, retryKey]);

  useEffect(() => {
    const qs = buildQuery({ q: debouncedQ, category, minPrice, maxPrice, inStock, freeShipping, verifiedSeller, sort, page });
    const current = window.location.search.replace(/^\?/, "");
    if (qs !== current) {
      router.replace(`/search${qs ? `?${qs}` : ""}`);
    }
  }, [debouncedQ, category, minPrice, maxPrice, inStock, freeShipping, verifiedSeller, sort, page, router]);

  const toggleCategory = (target: string) => {
    setCategory((prev) => {
      const list = prev ? prev.split(",").map((entry) => entry.trim()).filter(Boolean) : [];
      const next = list.includes(target)
        ? list.filter((entry) => entry !== target)
        : [...list, target];
      return next.join(",");
    });
    setPage(1);
    setLoading(true);
    setError(null);
  };

  const resetAll = () => {
    setQ("");
    setDebouncedQ("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    setFreeShipping(false);
    setVerifiedSeller(false);
    setSort("newest");
    setPage(1);
    setLoading(true);
    setError(null);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = Boolean(
    debouncedQ || category || minPrice || maxPrice || inStock || freeShipping || verifiedSeller,
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col gap-4 pt-4 lg:pt-6">
        <div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">Search the marketplace</h1>
          <p className="text-body-sm text-on-surface-variant">
            Full-text search across names, descriptions, categories and sellers, with advanced filters.
          </p>
        </div>

        <div className="relative w-full lg:max-w-xl">
          <Input
            icon="search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search products, categories or sellers..."
            aria-label="Search products"
          />
          {q && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQ("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline transition-colors hover:text-primary"
            >
              <Icon size="md">close</Icon>
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="flex flex-col gap-5 rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 className="text-headline-sm text-on-surface">Filters</h2>
              {hasFilters && (
                <button type="button" onClick={resetAll} className="text-label-sm text-primary hover:underline">
                  Reset
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-caption uppercase tracking-wider text-on-surface-variant">Category</span>
              <div className="flex flex-wrap gap-1.5">
                {SEARCH_CATEGORIES.map((cat) => {
                  const active = category.split(",").includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleCategory(cat)}
                      className={`rounded-full px-2.5 py-1 text-label-sm transition-colors ${
                        active
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container text-on-surface hover:bg-surface-container-high"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-caption uppercase tracking-wider text-on-surface-variant">Price</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(event) => {
                    setMinPrice(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Min"
                  aria-label="Minimum price"
                  className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <span className="text-outline">–</span>
                <input
                  type="number"
                  min={0}
                  value={maxPrice}
                  onChange={(event) => {
                    setMaxPrice(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Max"
                  aria-label="Maximum price"
                  className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-caption uppercase tracking-wider text-on-surface-variant">Show only</span>
              <div className="flex flex-wrap gap-1.5">
                <Toggle label="In stock" active={inStock} onClick={() => { setInStock(!inStock); setPage(1); }} />
                <Toggle label="Verified sellers" active={verifiedSeller} onClick={() => { setVerifiedSeller(!verifiedSeller); setPage(1); }} />
                <Toggle label="Free shipping" active={freeShipping} onClick={() => { setFreeShipping(!freeShipping); setPage(1); }} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="search-sort" className="text-caption uppercase tracking-wider text-on-surface-variant">
                Sort by
              </label>
              <select
                id="search-sort"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as Sort);
                  setPage(1);
                }}
                className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {SEARCH_SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-9" aria-live="polite">
          <div className="flex items-baseline gap-1.5 pb-3">
            <span className="text-headline-sm font-semibold text-on-surface">{loading ? "–" : total}</span>
            <span className="text-body-sm text-on-surface-variant">
              {total === 1 ? "result" : "results"}
              {debouncedQ ? ` for &ldquo;${debouncedQ}&rdquo;` : ""}
            </span>
          </div>

          {loading ? (
            <SkeletonGrid />
          ) : error ? (
            <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
              <Icon size="xl" className="text-outline">error</Icon>
              <p className="text-headline-sm text-on-surface">Something went wrong</p>
              <p className="text-body-sm text-on-surface-variant">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setRetryKey((key) => key + 1);
                }}
                className="mt-1 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
              <Icon size="xl" className="text-outline">search_off</Icon>
              <p className="text-headline-sm text-on-surface">No products found</p>
              <p className="text-body-sm text-on-surface-variant">
                Try a different search term or clear some filters.
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="mt-1 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                {items.map((product) => (
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
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                count={items.length}
                onChange={(next) => {
                  setPage(next);
                  setLoading(true);
                  setError(null);
                }}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Toggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-label-sm transition-colors ${
        active ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface hover:bg-surface-container-high"
      }`}
    >
      {label}
    </button>
  );
}
