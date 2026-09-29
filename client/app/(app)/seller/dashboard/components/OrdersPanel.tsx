"use client";

import { useMemo, useState } from "react";
import type { SellerOrder, SellerStatusCounts } from "@/services/seller.service";
import { Icon } from "@/components/ui/components/Icon";
import { formatCount, filterCount } from "./dashboardConfig";
import { ORDER_FILTERS, type OrderFilterId } from "./dashboardConfig";
import { OrderCard } from "./OrderCard";
import { OrderTable } from "./OrderTable";

type Props = {
  orders: SellerOrder[];
  total: number;
  statusCounts: SellerStatusCounts;
};

export function OrdersPanel({ orders, total, statusCounts }: Props) {
  const [filter, setFilter] = useState<OrderFilterId>("all");

  const visible = useMemo(() => {
    const active = ORDER_FILTERS.find((entry) => entry.id === filter);
    if (!active) return orders;
    return orders.filter((order) => active.match(order.status));
  }, [filter, orders]);

  return (
    <section className="flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="p-5 pb-0 lg:p-6 lg:pb-0">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-headline-sm text-on-surface">Order fulfillment queue</h2>
            <p className="text-body-sm text-on-surface-variant">
              Purchases that need your packaging and dispatch. Each amount is your share of the
              order, not the buyer&apos;s full total.
            </p>
          </div>
          <span className="shrink-0 text-label-sm text-on-surface-variant">
            {formatCount(total, "order", "orders")}
          </span>
        </div>

        <div
          role="group"
          aria-label="Filter orders by status"
          className="flex items-center gap-2 overflow-x-auto pb-3"
        >
          {ORDER_FILTERS.map((entry) => {
            const active = filter === entry.id;
            return (
              <button
                key={entry.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(entry.id)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-label-sm transition-all ${
                  active
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                {entry.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] font-bold ${
                    active ? "bg-on-primary/20" : "bg-surface-container"
                  }`}
                >
                  {filterCount(statusCounts, entry.id)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 pb-8 pt-4 text-center lg:px-6">
          <Icon size="lg" className="text-outline" aria-hidden="true">receipt_long</Icon>
          <p className="text-body-sm text-on-surface-variant">
            {total === 0
              ? "No orders yet. They will show up here as soon as a buyer checks out."
              : "No orders in this status right now."}
          </p>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-3 p-4 lg:hidden">
            {visible.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ul>
          <div className="hidden lg:block">
            <OrderTable orders={visible} />
          </div>
        </>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 bg-surface-container-low/30 px-4 py-3 lg:px-6">
        <span className="text-caption text-on-surface-variant">
          Showing {visible.length} of {total} orders
        </span>
        <span className="text-caption text-outline">Print labels and packing slips coming soon</span>
      </div>
    </section>
  );
}
