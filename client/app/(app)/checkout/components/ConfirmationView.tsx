"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ordersService, type Order } from "@/services/orders.service";
import { Icon } from "@/components/ui/components/Icon";
import { formatPrice } from "./delivery-methods";

type Props = {
  orderId: string;
};

export function ConfirmationView({ orderId }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    ordersService
      .getById(orderId)
      .then((res) => {
        if (cancelled) return;
        setOrder(res);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[checkout confirmation]", err);
        setError("We could not load your order. Try again.");
      });
    return () => {
      cancelled = true;
    };
  }, [orderId, retryKey]);

  if (error) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
        <Icon size="xl" className="text-outline">
          error
        </Icon>
        <p className="text-headline-sm text-on-surface">Could not load your order</p>
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
    );
  }

  if (!order) {
    return (
      <div
        aria-label="Loading confirmation"
        className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm"
      >
        <div className="h-12 w-12 animate-pulse rounded-full bg-surface-container-low" />
        <div className="h-5 w-48 animate-pulse rounded bg-surface-container-low" />
        <div className="h-4 w-64 animate-pulse rounded bg-surface-container-low" />
      </div>
    );
  }

  const itemCount = order.items.reduce((sum, line) => sum + line.qty, 0);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
        <Icon size="lg">check</Icon>
      </span>
      <p className="text-headline-md text-on-surface">Order confirmed</p>
      <p className="text-body-sm text-on-surface-variant">
        Order {order.id} • {itemCount} {itemCount === 1 ? "item" : "items"} • {formatPrice(order.total)}
      </p>
      <p className="text-caption text-on-surface-variant">Status: {order.status}</p>
      <Link
        href="/products"
        className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary-container"
      >
        <Icon size="md">shopping_bag</Icon>
        Continue shopping
      </Link>
    </div>
  );
}
