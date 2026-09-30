"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ApiError } from "@/services/api";
import { ordersService, type Order } from "@/services/orders.service";
import { productsService } from "@/services/products.service";
import { Icon } from "@/components/ui/components/Icon";
import { OrderStatusPill } from "../../components/OrderStatusPill";
import {
  deliveryMethodLabel,
  formatCurrency,
  formatOrderDate,
  orderReference,
  totalQuantity,
} from "../../components/ordersConfig";
import { TrackingPlaceholder } from "./TrackingPlaceholder";

type Props = { orderId: string };

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; order: Order; images: Record<string, string | null> };

export function OrderDetail({ orderId }: Props) {
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    ordersService
      .getById(orderId)
      .then(async (order) => {
        if (cancelled) return;
        const images = await loadProductImages(order);
        if (cancelled) return;
        setState({ status: "ready", order, images });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[orders/detail]", err);
        const status = err instanceof ApiError ? err.status : undefined;
        setState({
          status: "error",
          message:
            status === 404
              ? "We couldn't find that order. It may have been removed."
              : "We couldn't load this order. Try again in a moment.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, retryKey]);

  if (state.status === "loading") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col gap-4 pt-4 lg:pt-6" aria-label="Loading this order">
          <div className="h-6 w-40 animate-pulse rounded bg-surface-container-low" />
          <div className="h-64 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
        <Crumb />
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
          <Icon size="xl" className="text-outline">error</Icon>
          <p className="text-headline-sm text-on-surface">Couldn&apos;t load this order</p>
          <p className="text-body-sm text-on-surface-variant">{state.message}</p>
          <button
            type="button"
            onClick={() => {
              setState({ status: "loading" });
              setRetryKey((key) => key + 1);
            }}
            className="mt-1 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
          >
            Try again
          </button>
          <Link href="/orders" className="text-label-sm text-primary hover:underline">
            Back to your orders
          </Link>
        </div>
      </div>
    );
  }

  const { order, images } = state;
  const itemCount = totalQuantity(order);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 py-4 text-caption text-on-surface-variant">
        <Link href="/orders" className="transition-colors hover:text-primary">
          Your orders
        </Link>
        <Icon size="xs">chevron_right</Icon>
        <span className="text-on-surface">{orderReference(order)}</span>
      </nav>

      <div className="flex flex-col gap-1 pt-2 lg:pt-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-headline-md text-on-surface">Order {orderReference(order)}</h1>
          <OrderStatusPill status={order.status} />
        </div>
        <p className="text-body-sm text-on-surface-variant">
          Placed {formatOrderDate(order.createdAt)} • {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="border-b border-border p-4">
          <h2 className="text-headline-sm text-on-surface">Items</h2>
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {order.items.map((line, index) => {
            const image = line.productId ? images[line.productId] ?? null : null;
            return (
              <li key={`${line.productId}-${index}`} className="flex items-center gap-3 p-4">
                {image ? (
                  <Image
                    src={image}
                    alt={line.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-container text-outline">
                    <Icon size="lg">image</Icon>
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-label-md text-on-surface">{line.name}</p>
                  <p className="text-caption text-on-surface-variant">Qty {line.qty}</p>
                </div>
                <span className="shrink-0 text-label-md text-on-surface">
                  {formatCurrency(line.price * line.qty)}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-2 border-t border-border p-4">
          {typeof order.subtotal === "number" && (
            <div className="flex justify-between text-body-sm text-on-surface-variant">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
          )}
          {typeof order.shippingCost === "number" && (
            <div className="flex justify-between text-body-sm text-on-surface-variant">
              <span>{deliveryMethodLabel(order.deliveryMethod)}</span>
              <span>{order.shippingCost === 0 ? "Free" : formatCurrency(order.shippingCost)}</span>
            </div>
          )}
          <div className="flex justify-between text-label-md text-on-surface">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {(order.fullName || order.address) && (
        <div className="mt-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm">
          <h2 className="text-headline-sm text-on-surface">Delivering to</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            {order.fullName}
            <br />
            {order.address}
            <br />
            {order.city}, {order.zip}
            <br />
            {order.country}
          </p>
        </div>
      )}

      <TrackingPlaceholder />

      <div className="mt-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md text-on-primary transition-colors hover:bg-primary-container"
        >
          <Icon size="md">shopping_bag</Icon>
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

function Crumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 py-4 text-caption text-on-surface-variant">
      <Link href="/orders" className="transition-colors hover:text-primary">
        Your orders
      </Link>
      <Icon size="xs">chevron_right</Icon>
      <span className="text-on-surface">Order</span>
    </nav>
  );
}

async function loadProductImages(order: Order): Promise<Record<string, string | null>> {
  const ids = Array.from(new Set(order.items.map((line) => line.productId).filter(Boolean)));
  if (ids.length === 0) return {};
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const product = await productsService.getById(id);
        return [id, product.images[0] ?? null] as const;
      } catch {
        return [id, null] as const;
      }
    }),
  );
  return Object.fromEntries(results);
}
