"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/components/Icon";
import { ApiError } from "@/services/api";
import {
  sellerService,
  type SellerOrderList,
  type SellerRange,
  type SellerStats,
} from "@/services/seller.service";
import { formatCount, formatCurrency, filterCount, rangeLabel } from "./dashboardConfig";
import { DateRangeControl } from "./DateRangeControl";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { MetricCard } from "./MetricCard";
import { OrdersPanel } from "./OrdersPanel";
import { PayoutBanner } from "./PayoutBanner";
import { StockAlerts } from "./StockAlerts";
import { StudioHeader } from "./StudioHeader";

const EMPTY_STATS: SellerStats = {
  gmv: 0,
  orderCount: 0,
  activeSkuCount: 0,
  inStockSkuCount: 0,
  lowStockCount: 0,
  outOfStockCount: 0,
  lowStockItems: [],
  lowStockThreshold: 0,
  statusCounts: {},
};

const EMPTY_ORDERS: SellerOrderList = { items: [], total: 0, statusCounts: {} };

type RangeStats = Partial<Record<SellerRange, SellerStats>>;
type RangeErrors = Partial<Record<SellerRange, string>>;

export function SellerDashboard() {
  const [range, setRange] = useState<SellerRange>("all");
  const [statsByRange, setStatsByRange] = useState<RangeStats>({});
  const [statsErrors, setStatsErrors] = useState<RangeErrors>({});
  const [pendingRange, setPendingRange] = useState<SellerRange | null>("all");
  const [orders, setOrders] = useState<SellerOrderList | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const changeRange = (next: SellerRange) => {
    setRange(next);
    if (statsByRange[next] === undefined) setPendingRange(next);
  };

  useEffect(() => {
    let cancelled = false;

    sellerService
      .stats(range)
      .then((next) => {
        if (cancelled) return;
        setStatsByRange((prev) => ({ ...prev, [range]: next }));
        setPendingRange((current) => (current === range ? null : current));
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[seller/dashboard/stats]", err);
        const status = err instanceof ApiError ? err.status : undefined;
        setStatsErrors((prev) => ({
          ...prev,
          [range]:
            status === 403
              ? "Your seller account can't read these numbers. Contact the marketplace team."
              : "We couldn't load the numbers for that period.",
        }));
        setPendingRange((current) => (current === range ? null : current));
      });

    return () => {
      cancelled = true;
    };
  }, [range, retryKey]);

  useEffect(() => {
    let cancelled = false;

    sellerService
      .orders()
      .then((next) => {
        if (cancelled) return;
        setOrders(next);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[seller/dashboard/orders]", err);
        setOrdersError("We couldn't load your order queue. Try again in a moment.");
      });

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  if (!orders && !ordersError) return <DashboardSkeleton />;

  const stats = statsByRange[range] ?? EMPTY_STATS;
  const statsError = statsErrors[range];
  const statsLoading = pendingRange === range;
  const orderData = orders ?? EMPTY_ORDERS;
  const toShipCount = filterCount(orders?.statusCounts, "to_ship");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-16">
      <div className="flex flex-col gap-3 pt-4 lg:flex-row lg:items-start lg:justify-between lg:pt-0">
        <StudioHeader />
        <DateRangeControl value={range} onChange={changeRange} />
      </div>

      {ordersError ? (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
          <Icon size="xl" className="text-outline" aria-hidden="true">error</Icon>
          <p className="text-headline-sm text-on-surface">Studio data unavailable</p>
          <p className="text-body-sm text-on-surface-variant">{ordersError}</p>
          <button
            type="button"
            onClick={() => {
              setOrdersError(null);
              setRetryKey((key) => key + 1);
            }}
            className="mt-1 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {statsError && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-error-container px-3.5 py-2.5 text-body-sm text-on-error-container"
            >
              {statsError}
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            <MetricCard
              label={range === "all" ? "Total studio GMV" : `GMV · ${rangeLabel(range)}`}
              value={statsLoading ? "—" : formatCurrency(stats.gmv)}
              icon="payments"
              iconChip="bg-surface-container text-primary"
              caption="Sales value across your orders"
            />
            <MetricCard
              label="Net maker earnings"
              value="Not yet"
              icon="account_balance"
              iconChip="bg-surface-container text-secondary"
              caption="Aura does not deduct commission yet, so there is no net figure to show"
            />
            <MetricCard
              label="Orders"
              value={statsLoading ? "—" : String(stats.orderCount)}
              icon="local_shipping"
              iconChip="bg-error-container/40 text-error"
              caption={`${formatCount(toShipCount, "order", "orders")} still need dispatch`}
            />
            <MetricCard
              label="Active listings"
              value={statsLoading ? "—" : String(stats.activeSkuCount)}
              icon="inventory_2"
              iconChip="bg-tertiary-fixed text-tertiary"
              caption={
                statsLoading
                  ? "Loading catalog counts"
                  : `${stats.inStockSkuCount} in stock · ${stats.lowStockCount} low · ${stats.outOfStockCount} sold out`
              }
            />
          </div>

          <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="flex flex-col gap-8 lg:col-span-8">
              <PayoutBanner />
              <OrdersPanel
                orders={orderData.items}
                total={orderData.total}
                statusCounts={orderData.statusCounts}
              />
            </div>
            <div className="lg:col-span-4">
              <StockAlerts
                items={stats.lowStockItems}
                lowStockCount={stats.lowStockCount}
                outOfStockCount={stats.outOfStockCount}
                threshold={stats.lowStockThreshold}
                loading={statsLoading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
