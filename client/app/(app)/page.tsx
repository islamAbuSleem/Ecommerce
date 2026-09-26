"use client";

import { useEffect, useMemo, useState } from "react";
import { productsService, type Product } from "@/services/products.service";
import { isVerifiedSeller } from "@/components/products/sellers";
import { QuickSearchBar } from "./components/QuickSearchBar";
import { Hero } from "./components/Hero";
import { TrustRibbon } from "./components/TrustRibbon";
import { CategoryGrid } from "./components/CategoryGrid";
import { TrendingSection } from "./components/TrendingSection";
import { VendorSpotlight, type SpotlightSeller } from "./components/VendorSpotlight";
import { TrustBar } from "./components/TrustBar";

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "IM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function deriveSpotlight(items: Product[]): SpotlightSeller | null {
  const groups = new Map<string, { name: string; verified: boolean; ratings: number[]; count: number }>();
  for (const item of items) {
    const key = item.seller?.id ?? `name:${item.seller?.fullName ?? "independent"}`;
    const name = item.seller?.fullName ?? "Independent maker";
    const entry = groups.get(key) ?? {
      name,
      verified: false,
      ratings: [],
      count: 0,
    };
    entry.name = name;
    entry.count += 1;
    if (isVerifiedSeller(item.seller?.sellerStatus)) entry.verified = true;
    if (typeof item.ratingAvg === "number") entry.ratings.push(item.ratingAvg);
    groups.set(key, entry);
  }
  let best: { name: string; verified: boolean; ratings: number[]; count: number } | null = null;
  let bestCount = 0;
  for (const entry of groups.values()) {
    const count = entry.count;
    if (count > bestCount) {
      best = entry;
      bestCount = count;
    }
  }
  if (!best) return null;
  const avg =
    best.ratings.length > 0
      ? best.ratings.reduce((a, b) => a + b, 0) / best.ratings.length
      : null;
  return {
    name: best.name,
    verified: best.verified,
    productCount: bestCount,
    avgRating: avg,
    initials: initialsFor(best.name),
  };
}

export default function Home() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [activePill, setActivePill] = useState("all");

  useEffect(() => {
    let cancelled = false;
    productsService
      .list({ sort: "rating", limit: 8 })
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[home trending]", err);
        setError("Something went wrong. Try again.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  const filtered = useMemo(() => {
    switch (activePill) {
      case "verified":
        return items.filter((p) => isVerifiedSeller(p.seller?.sellerStatus));
      case "top-rated":
        return items.filter((p) => (p.ratingAvg ?? 0) >= 4.8);
      case "shipping":
        return items.filter((p) => p.freeShipping);
      default:
        return items;
    }
  }, [items, activePill]);

  const spotlight = useMemo(() => deriveSpotlight(items), [items]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
      <div className="pt-4 lg:pt-6">
        <QuickSearchBar />
      </div>
      <div className="mt-4">
        <Hero />
      </div>
      <TrustRibbon />
      <CategoryGrid />
      <div className="rounded-2xl bg-surface-container-low px-4 py-2 sm:px-6">
        <TrendingSection
          products={filtered}
          loading={loading}
          error={error}
          activePill={activePill}
          onPillChange={setActivePill}
          onRetry={() => {
            setLoading(true);
            setError(null);
            setRetryKey((k) => k + 1);
          }}
        />
      </div>
      {spotlight && (
        <div className="mt-8">
          <VendorSpotlight seller={spotlight} />
        </div>
      )}
      <div className="mt-8">
        <TrustBar />
      </div>
    </div>
  );
}
