"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError } from "@/services/api";
import {
  adminService,
  type AdminAnalytics,
  type AdminAnalyticsRange,
} from "@/services/admin.service";
import { Icon } from "@/components/ui/components/Icon";
import { loadError } from "../../vendors/components/adminConfig";
import { ANALYTICS_RANGES, formatCurrency, formatInt } from "./dashboardConfig";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { KpiCard } from "./KpiCard";
import { OrdersOverTimeChart } from "./OrdersOverTimeChart";
import { CategoryGmvBar } from "./CategoryGmvBar";
import { TopSellersTable } from "./TopSellersTable";
import { LowStockWidget } from "./LowStockWidget";
import { PayoutsNotConfigured } from "./PayoutsNotConfigured";
import { CommissionOverview } from "./CommissionOverview";

type RangeDataMap = Partial<Record<AdminAnalyticsRange, AdminAnalytics>>;
type RangeErrorMap = Partial<Record<AdminAnalyticsRange, string>>;

export function AdminDashboard() {
  const [range, setRange] = useState<AdminAnalyticsRange>("30d");
  const [dataByRange, setDataByRange] = useState<RangeDataMap>({});
  const [errorsByRange, setErrorsByRange] = useState<RangeErrorMap>({});
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    adminService
      .analytics(range)
      .then((next) => {
        if (cancelled) return;
        setDataByRange((prev) => ({ ...prev, [range]: next }));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[admin/dashboard]", err);
        const status = err instanceof ApiError ? err.status : undefined;
        setErrorsByRange((prev) => ({ ...prev, [range]: loadError(status) }));
      });

    return () => {
      cancelled = true;
    };
  }, [range, retryKey]);

  const data = dataByRange[range];
  const error = errorsByRange[range];
  const loading = data === undefined && error === undefined;

  if (error) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
          <Icon size="xl" className="text-outline">error</Icon>
          <p className="text-headline-sm text-on-surface">Couldn&apos;t load platform analytics</p>
          <p className="text-body-sm text-on-surface-variant">{error}</p>
          <button
            type="button"
            onClick={() => {
              setErrorsByRange((prev) => {
                const next = { ...prev };
                delete next[range];
                return next;
              });
              setRetryKey((key) => key + 1);
            }}
            className="mt-1 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!data || loading) return <DashboardSkeleton />;

  const { kpis, series, seriesLabel, categories, topSellers, lowStock } = data;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col gap-4 pt-4 lg:flex-row lg:items-end lg:justify-between lg:pt-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-fixed px-2.5 py-0.5 text-caption text-on-primary-fixed-variant">
            <Icon size="xs" aria-hidden="true">shield_person</Icon>
            Platform ops
          </span>
          <h1 className="mt-2 text-headline-lg text-on-surface tracking-tight">Platform overview</h1>
          <p className="text-body-sm text-on-surface-variant">
            Marketplace health from live orders, sellers and listings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Reporting window"
            className="flex items-center gap-1 rounded-lg bg-surface-container-lowest p-1 shadow-sm"
          >
            {ANALYTICS_RANGES.map((entry) => {
              const active = range === entry.id;
              const short = entry.label.replace("Last ", "").replace("All time", "All");
              return (
                <button
                  key={entry.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setRange(entry.id)}
                  className={`rounded-md px-2.5 py-1.5 text-label-sm transition-colors ${
                    active ? "bg-primary text-on-primary" : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {short}
                </button>
              );
            })}
          </div>
          <Link
            href="/admin/vendors"
            className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-lowest px-3.5 py-2 text-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container"
          >
            <Icon size="md" aria-hidden="true">how_to_reg</Icon>
            Review applications{kpis.pendingApplications > 0 ? ` (${kpis.pendingApplications})` : ""}
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        <KpiCard
          label="Gross sales"
          value={formatCurrency(kpis.gmv)}
          icon="payments"
          iconChip="bg-surface-container text-primary"
          caption="Sum of order totals in window"
        />
        <KpiCard
          label="Orders"
          value={formatInt(kpis.orderCount)}
          icon="receipt_long"
          iconChip="bg-surface-container text-secondary"
          caption="Placed in this window"
        />
        <KpiCard
          label="Approved sellers"
          value={formatInt(kpis.approvedSellers)}
          icon="storefront"
          iconChip="bg-success-lightest text-success-foreground"
          caption="Live storefronts"
        />
        <KpiCard
          label="Pending applications"
          value={formatInt(kpis.pendingApplications)}
          icon="how_to_reg"
          iconChip="bg-tertiary-fixed text-tertiary"
          caption="Awaiting admin review"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <OrdersOverTimeChart series={series} label={seriesLabel} />
          <CategoryGmvBar categories={categories} />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-5">
          <TopSellersTable sellers={topSellers} />
          <LowStockWidget lowStock={lowStock} />
          <CommissionOverview />
          <PayoutsNotConfigured />
        </div>
      </div>
    </div>
  );
}
