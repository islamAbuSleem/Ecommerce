"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProfileGuard } from "./guard";
import { useAuth } from "@/components/auth/AuthContext";
import { Icon } from "@/components/ui/components/Icon";
import { ordersService, type Order } from "@/services/orders.service";
import { OrderStatusPill } from "../orders/components/OrderStatusPill";
import {
  formatCurrency,
  formatOrderDate,
  orderReference,
} from "../orders/components/ordersConfig";

export default function ProfilePage() {
  return (
    <ProfileGuard>
      <ProfileInner />
    </ProfileGuard>
  );
}

function memberSince(value: string | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ProfileInner() {
  const { user } = useAuth();

  if (!user) return null;

  const roleLabel =
    user.role === "admin"
      ? "Admin"
      : user.role === "seller"
        ? user.sellerStatus === "approved"
          ? "Verified seller"
          : "Seller (pending approval)"
        : "Buyer";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col gap-4 pt-4 lg:pt-6">
        <h1 className="text-headline-md text-on-surface">Profile</h1>
        <div className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon size="lg">person</Icon>
            </span>
            <div>
              <p className="text-headline-sm text-on-surface">{user.fullName || "No name set"}</p>
              <p className="text-body-sm text-on-surface-variant">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-surface-container/60 p-4">
              <p className="text-caption text-on-surface-variant">Role</p>
              <p className="text-label-md text-on-surface">{roleLabel}</p>
            </div>
            <div className="rounded-lg bg-surface-container/60 p-4">
              <p className="text-caption text-on-surface-variant">Member since</p>
              <p className="text-label-md text-on-surface">{memberSince(user.createdAt)}</p>
            </div>
          </div>
        </div>
        <QuickLinks role={user.role} />
        <RecentOrders />
      </div>
    </div>
  );
}

function QuickLinks({ role }: { role: string }) {
  const links = [
    { href: "/orders", icon: "receipt_long", title: "My orders", body: "Track and review your purchases." },
    { href: "/checkout", icon: "shopping_bag", title: "Cart & checkout", body: "Review your cart and place orders." },
  ];
  if (role === "seller") {
    links.push({
      href: "/seller/dashboard",
      icon: "storefront",
      title: "Seller dashboard",
      body: "Earnings, products, and incoming orders.",
    });
  }
  if (role === "admin") {
    links.push({
      href: "/admin/dashboard",
      icon: "monitoring",
      title: "Admin dashboard",
      body: "Platform health and commission.",
    });
  }
  return (
    <section aria-label="Shortcuts" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-start gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-colors hover:bg-surface-container-low"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon size="md">{link.icon}</Icon>
          </span>
          <span className="min-w-0">
            <span className="block text-label-md text-on-surface">{link.title}</span>
            <span className="mt-0.5 block text-body-sm text-on-surface-variant">{link.body}</span>
          </span>
        </Link>
      ))}
    </section>
  );
}

type OrdersState =
  | { status: "loading" }
  | { status: "ready"; orders: Order[] }
  | { status: "error" };

function RecentOrders() {
  const [state, setState] = useState<OrdersState>({ status: "loading" });
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    ordersService
      .list(3)
      .then((page) => {
        if (cancelled) return;
        setState({ status: "ready", orders: page.items });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [retryKey]);

  return (
    <section aria-label="Recent orders" className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm text-on-surface">Recent orders</h2>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-label-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          View all
          <Icon size="sm">arrow_forward</Icon>
        </Link>
      </div>
      {state.status === "loading" && (
        <div className="flex flex-col gap-2" aria-label="Loading recent orders">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-surface-container-low" />
          ))}
        </div>
      )}
      {state.status === "error" && (
        <div className="flex flex-col items-start gap-2">
          <p className="text-body-sm text-on-surface-variant">
            We couldn&apos;t load your recent orders.
          </p>
          <button
            type="button"
            onClick={() => {
              setState({ status: "loading" });
              setRetryKey((key) => key + 1);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
          >
            Try again
          </button>
        </div>
      )}
      {state.status === "ready" &&
        (state.orders.length === 0 ? (
          <p className="text-body-sm text-on-surface-variant">
            No orders yet — your recent purchases will appear here.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {state.orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg bg-surface-container/60 p-3 transition-colors hover:bg-surface-container"
                >
                  <span className="min-w-0">
                    <span className="block text-label-md text-on-surface">
                      {orderReference(order)}
                    </span>
                    <span className="mt-0.5 block text-caption text-on-surface-variant">
                      {formatOrderDate(order.createdAt)}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-label-md text-on-surface">
                      {formatCurrency(order.total)}
                    </span>
                    <OrderStatusPill status={order.status} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
