"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/products/components/ProductCard";
import { Input } from "@/components/ui/components/Input";
import { SkeletonGrid } from "./components/SkeletonGrid";
import { FilterSidebar } from "./components/FilterSidebar";
import { Pagination } from "./components/Pagination";
import { ApiError } from "@/services/api";
import {
  productsService,
  type ListParams,
  type Product,
  type ProductSort,
} from "@/services/products.service";

const FILTER_PILLS: { id: string; label: string; params: Partial<ListParams> }[] = [
  { id: "all", label: "All Items", params: {} },
  { id: "under100", label: "Under $100", params: { maxPrice: 100 } },
  { id: "verified", label: "Verified Sellers", params: { verifiedSeller: true } },
  { id: "shipping", label: "Free Shipping", params: { freeShipping: true } },
  { id: "rating", label: "4.5+ Stars", params: { minRating: 4.5 } },
];

// Design-system rule: TEXT labels, no emojis (mock shows emoji here).
const CATEGORY_TAGS: { id: string; label: string }[] = [
  { id: "Tech & Audio", label: "Tech & Audio" },
  { id: "Desk Setup", label: "Desk Setup" },
  { id: "Handmade Home", label: "Handmade Home" },
  { id: "Leathercraft", label: "Leathercraft" },
];

const SORT_OPTIONS: { id: ProductSort; label: string }[] = [
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
];

const PAGE_SIZE = 12;
const SEARCH_DEBOUNCE_MS = 300;

function isVerifiedSeller(status: string | null | undefined): boolean {
  return status === "approved";
}

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [activePill, setActivePill] = useState("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<ProductSort>("newest");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const isFirstQueryRender = useRef(true);

  useEffect(() => {
    if (isFirstQueryRender.current) {
      isFirstQueryRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      setDebouncedQ(query.trim());
      setPage(1);
      setLoading(true);
      setError(null);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    const pill = FILTER_PILLS.find((p) => p.id === activePill);
    const params: ListParams = { sort, page, limit: PAGE_SIZE, ...pill?.params };
    if (debouncedQ) params.q = debouncedQ;
    if (activeCategory) params.category = activeCategory;

    productsService
      .list(params)
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setTotal(res.total);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[products]", err);
        const status = err instanceof ApiError ? err.status : undefined;
        if (status === 400) {
          setError("Those filters didn't work. Try clearing them and try again.");
        } else {
          setError("Something went wrong. Try again.");
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQ, activePill, activeCategory, sort, page, retryKey]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasActiveFilters = activePill !== "all" || activeCategory !== null || debouncedQ !== "";
  const showSkeleton = loading && items.length === 0;

  const resetAll = () => {
    setQuery("");
    setDebouncedQ("");
    setActivePill("all");
    setActiveCategory(null);
    setSort("newest");
    setPage(1);
    setLoading(true);
    setError(null);
  };

  const selectPill = (id: string) => {
    setActivePill(id);
    setPage(1);
    setLoading(true);
    setError(null);
  };

  const toggleCategory = (id: string) => {
    setActiveCategory((prev) => (prev === id ? null : id));
    setPage(1);
    setLoading(true);
    setError(null);
  };

  const changeSort = (next: ProductSort) => {
    setSort(next);
    setPage(1);
    setLoading(true);
    setError(null);
  };

  const changePage = (next: number) => {
    setPage(next);
    setLoading(true);
    setError(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-16">
      {/* Breadcrumb (desktop) */}
      <nav
        aria-label="Breadcrumb"
        className="hidden lg:flex items-center gap-1 py-4 text-caption text-on-surface-variant"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          Explore
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-on-surface font-medium">All Products</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 pt-4 lg:pt-0 lg:pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="hidden lg:block text-headline-lg text-on-surface tracking-tight">
              Explore the Marketplace
            </h1>
            <p className="hidden lg:block text-body-md text-on-surface-variant mt-1 max-w-2xl">
              Discover pieces from independent makers, studios, and verified sellers.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex items-center bg-surface-container-lowest rounded-lg shadow-sm px-3 py-1.5 gap-1 text-on-surface">
              <span className="text-label-sm text-on-surface-variant">Sort by:</span>
              <select
                aria-label="Sort products"
                value={sort}
                onChange={(e) => changeSort(e.target.value as ProductSort)}
                className="bg-transparent text-label-md text-on-surface focus:outline-none cursor-pointer pr-1"
              >
                {SORT_OPTIONS.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[18px] text-outline pointer-events-none">
                arrow_drop_down
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <Input
            icon="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products or sellers..."
            aria-label="Search products or sellers"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 -mx-4 px-4 sm:mx-0 sm:px-0 lg:flex-wrap">
          {FILTER_PILLS.map(({ id, label }) => {
            const active = activePill === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectPill(id)}
                aria-pressed={active}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-label-sm shadow-sm transition-all active:scale-95 flex items-center gap-1.5 ${
                  active
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-lowest text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>{label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-on-primary" />}
              </button>
            );
          })}
        </div>

        {/* Category tag chips */}
        <div className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 py-0.5">
          <span className="text-caption text-outline flex items-center gap-1 uppercase tracking-wider pr-1 shrink-0">
            <span className="material-symbols-outlined text-[14px]">category</span>
            Tags
          </span>
          {CATEGORY_TAGS.map(({ id, label }) => {
            const active = activeCategory === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleCategory(id)}
                aria-pressed={active}
                className={`px-2.5 py-1 rounded-lg text-label-sm whitespace-nowrap transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-baseline gap-1.5 min-w-0 pt-3 lg:pt-0 lg:pb-4">
        <span className="text-headline-sm text-on-surface font-semibold">{loading ? "–" : total}</span>
        <span className="text-body-sm text-on-surface-variant truncate">
          {total === 1 ? "discovery curated" : "discoveries curated"}
        </span>
      </div>

      {/* Applied-filters strip (desktop) */}
      {hasActiveFilters && (
        <div className="hidden lg:flex flex-wrap items-center gap-2 mb-6 bg-surface-container-low p-3 rounded-xl">
          <span className="text-label-sm text-on-surface-variant px-1 font-medium">Applied:</span>
          {activePill !== "all" && (
            <span className="inline-flex items-center gap-1 bg-surface-container-lowest text-on-surface text-label-sm px-2.5 py-1 rounded-full shadow-sm">
              {FILTER_PILLS.find((p) => p.id === activePill)?.label}
              <button
                type="button"
                aria-label="Clear filter"
                onClick={() => selectPill("all")}
                className="hover:text-primary transition-colors ml-1"
              >
                <span className="material-symbols-outlined text-[14px] align-middle">close</span>
              </button>
            </span>
          )}
          {activeCategory && (
            <span className="inline-flex items-center gap-1 bg-surface-container-lowest text-on-surface text-label-sm px-2.5 py-1 rounded-full shadow-sm">
              {activeCategory}
              <button
                type="button"
                aria-label="Clear category"
                onClick={() => toggleCategory(activeCategory)}
                className="hover:text-primary transition-colors ml-1"
              >
                <span className="material-symbols-outlined text-[14px] align-middle">close</span>
              </button>
            </span>
          )}
          {debouncedQ && (
            <span className="inline-flex items-center gap-1 bg-surface-container-lowest text-on-surface text-label-sm px-2.5 py-1 rounded-full shadow-sm">
              &ldquo;{debouncedQ}&rdquo;
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  setQuery("");
                  setDebouncedQ("");
                  setPage(1);
                }}
                className="hover:text-primary transition-colors ml-1"
              >
                <span className="material-symbols-outlined text-[14px] align-middle">close</span>
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={resetAll}
            className="text-label-sm text-primary hover:text-on-primary-fixed-variant ml-1 font-semibold underline underline-offset-2"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Trust banner (mobile) */}
      <div className="lg:hidden flex items-center justify-between px-3.5 py-2.5 mb-4 rounded-xl bg-surface-container-low text-on-surface shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm leading-tight text-on-surface">Aura Purchase Protection</span>
            <span className="text-caption text-outline leading-tight">
              Every transaction directly backed by makers
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar (desktop) */}
        <FilterSidebar
          activeCategory={activeCategory}
          activePill={activePill}
          pills={FILTER_PILLS}
          tags={CATEGORY_TAGS}
          onToggleCategory={toggleCategory}
          onSelectPill={selectPill}
        />

        {/* Results */}
        <section className="lg:col-span-9" aria-live="polite">
          {showSkeleton ? (
            <SkeletonGrid />
          ) : error ? (
            <div className="flex flex-col items-center gap-3 bg-surface-container-lowest rounded-xl shadow-sm p-10 text-center">
              <span className="material-symbols-outlined text-[32px] text-outline">error</span>
              <p className="text-headline-sm text-on-surface">Something went wrong</p>
              <p className="text-body-sm text-on-surface-variant">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  setRetryKey((k) => k + 1);
                }}
                className="mt-1 px-4 py-2 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary-container transition-colors"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center gap-3 bg-surface-container-lowest rounded-xl shadow-sm p-10 text-center">
              <span className="material-symbols-outlined text-[32px] text-outline">search_off</span>
              <p className="text-headline-sm text-on-surface">No products found</p>
              <p className="text-body-sm text-on-surface-variant">
                Try a different search term or clear your filters.
              </p>
              <button
                type="button"
                onClick={resetAll}
                className="mt-1 px-4 py-2 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary-container transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
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

              {/* Pagination */}
              <Pagination page={page} totalPages={totalPages} total={total} count={items.length} onChange={changePage} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
