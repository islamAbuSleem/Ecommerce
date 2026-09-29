"use client";

import Link from "next/link";
import type { SellerLowStockItem } from "@/services/seller.service";
import { Icon } from "@/components/ui/components/Icon";
import { formatCount, formatCurrency } from "./dashboardConfig";

type Props = {
  items: SellerLowStockItem[];
  lowStockCount: number;
  outOfStockCount: number;
  threshold: number;
  loading: boolean;
};

export function StockAlerts({
  items,
  lowStockCount,
  outOfStockCount,
  threshold,
  loading,
}: Props) {
  // The list holds every active listing with stock between 1 and the threshold.
  // Sold-out listings are reported separately, and the server caps this payload.
  const capped = lowStockCount > items.length;

  return (
    <section className="flex flex-col rounded-xl bg-surface-container-lowest p-5 shadow-sm lg:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-headline-sm text-on-surface">Stock alerts</h2>
          <span className="rounded-full bg-error-container px-2 py-0.5 text-label-sm font-semibold text-on-error-container">
            {loading ? "—" : `${lowStockCount} need attention`}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-2 rounded-lg bg-surface-container-low/50 px-4 py-8 text-center">
          <Icon size="lg" className="text-secondary" aria-hidden="true">check_circle</Icon>
          <p className="text-body-sm text-on-surface-variant">Loading stock levels…</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg bg-surface-container-low/50 px-4 py-8 text-center">
          <Icon size="lg" className="text-secondary" aria-hidden="true">check_circle</Icon>
          <p className="text-body-sm text-on-surface-variant">
            {threshold > 0
              ? `Every active listing is above ${threshold} units in stock.`
              : "No active listings are low on stock."}
          </p>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg bg-surface-container-low/50 p-3 transition-colors hover:bg-surface-container-low"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
                  <Icon size="lg" aria-hidden="true">inventory_2</Icon>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-label-md text-on-surface">{item.name}</p>
                  <p className="truncate text-caption text-on-surface-variant">
                    {formatCurrency(item.price)}
                  </p>
                  <p className="mt-1 text-label-sm font-semibold text-error">
                    {formatCount(item.stock, "unit", "units")} left
                    {threshold > 0 && (
                      <span className="ml-1 font-normal text-outline">(threshold {threshold})</span>
                    )}
                  </p>
                </div>
                <Link
                  href={`/seller/products/${item.id}/edit`}
                  className="shrink-0 rounded-lg bg-primary-fixed px-2.5 py-1.5 text-label-sm font-semibold text-on-primary-fixed-variant transition-colors hover:bg-primary hover:text-on-primary"
                >
                  Restock
                </Link>
              </li>
            ))}
          </ul>
          {outOfStockCount > 0 && (
            <p className="mt-3 flex items-center gap-2 rounded-lg bg-error-container/40 px-3 py-2 text-caption text-on-error-container">
              <Icon size="sm" aria-hidden="true">block</Icon>
              {outOfStockCount === 1
                ? "1 listing is sold out."
                : `${outOfStockCount} listings are sold out.`}{" "}
              Sold-out listings are not in this list.
            </p>
          )}
          {capped && (
            <p className="mt-3 text-caption text-outline">
              Showing {items.length} of {lowStockCount} listings at or below {threshold} units.
            </p>
          )}
        </>
      )}

      <p className="mt-4 flex items-center gap-2 rounded-lg bg-surface-container-low/40 p-3 text-caption text-on-surface-variant">
        <Icon size="sm" className="text-primary" aria-hidden="true">auto_mode</Icon>
        Auto-replenish alerts are not available. Check stock manually.
      </p>
    </section>
  );
}
