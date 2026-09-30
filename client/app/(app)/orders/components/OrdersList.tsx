"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError } from "@/services/api";
import { ordersService, type Order } from "@/services/orders.service";
import { Icon } from "@/components/ui/components/Icon";
import { OrderRow } from "./OrderRow";
import { OrderTable } from "./OrderTable";

const PAGE_SIZE = 50;

export function OrdersList() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    ordersService
      .list(PAGE_SIZE)
      .then((page) => {
        if (cancelled) return;
        setOrders(page.items);
        setHasMore(page.hasMore);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[orders/list]", err);
        const status = err instanceof ApiError ? err.status : undefined;
        setError(
          status === 401
            ? "Your session expired. Please sign in again."
            : "We couldn't load your orders. Try again in a moment.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  const loadMore = () => {
    if (loadingMore || orders === null) return;
    setLoadingMore(true);
    ordersService
      .list(PAGE_SIZE, orders.length)
      .then((page) => {
        setOrders((prev) => (prev ? [...prev, ...page.items] : prev));
        setHasMore(page.hasMore);
      })
      .catch((err: unknown) => {
        console.error("[orders/list/more]", err);
      })
      .finally(() => {
        setLoadingMore(false);
      });
  };

  if (error) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <PageHeader />
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
          <Icon size="xl" className="text-outline">error</Icon>
          <p className="text-headline-sm text-on-surface">Couldn&apos;t load your orders</p>
          <p className="text-body-sm text-on-surface-variant">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setOrders(null);
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

  const rows = orders ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
      <PageHeader />

      {orders === null ? (
        <div className="mt-4 flex flex-col gap-3" aria-label="Loading your orders">
          <div className="h-24 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
          <div className="h-24 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
          <Icon size="xl" className="text-outline">receipt_long</Icon>
          <p className="text-headline-sm text-on-surface">No orders yet</p>
          <p className="text-body-sm text-on-surface-variant">
            Once you check out, your orders will appear here.
          </p>
          <Link
            href="/products"
            className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary-container"
          >
            <Icon size="md">shopping_bag</Icon>
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-4 flex flex-col gap-3 lg:hidden">
            {rows.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </ul>
          <div className="mt-4 hidden lg:block">
            <OrderTable orders={rows} />
          </div>
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-label-md text-on-surface transition-colors hover:bg-surface-container disabled:opacity-60"
              >
                <Icon size="sm">expand_more</Icon>
                {loadingMore ? "Loading..." : "Load older orders"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-col gap-1 pt-4 lg:pt-6">
      <h1 className="text-headline-md text-on-surface">Your orders</h1>
      <p className="text-body-sm text-on-surface-variant">
        Everything you&apos;ve purchased, and where each order stands.
      </p>
    </div>
  );
}
