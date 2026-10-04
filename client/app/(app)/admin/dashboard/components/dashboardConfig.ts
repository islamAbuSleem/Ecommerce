import type { AdminAnalyticsRange } from "@/services/admin.service";

export const ANALYTICS_RANGES: { id: AdminAnalyticsRange; label: string }[] = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
  { id: "all", label: "All time" },
];

export function rangeLabel(range: AdminAnalyticsRange): string {
  return ANALYTICS_RANGES.find((entry) => entry.id === range)?.label ?? "Last 30 days";
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatCurrency(value: number): string {
  return currency.format(value);
}

const compactCurrency = new Intl.NumberFormat("en-US", {
  notation: "compact",
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 1,
});

export function formatCompactCurrency(value: number): string {
  return compactCurrency.format(value);
}

const int = new Intl.NumberFormat("en-US");

export function formatInt(value: number): string {
  return int.format(value);
}

export function sellerDisplayName(name: string | null, fallback: string): string {
  const trimmed = name?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

export const CHART_COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-tertiary",
  "bg-info",
  "bg-success",
  "bg-outline",
];

/**
 * Payouts/settlements are the one financial capability Aura has not built. Rather
 * than render a live figure or a green check, it is listed as plainly unavailable.
 * (Commission itself is real and shown in the "Commission collected" panel.)
 */
export const PAYOUTS_UNAVAILABLE: { icon: string; title: string; body: string }[] = [
  {
    icon: "currency_exchange",
    title: "Payouts & settlements",
    body: "Stripe is integrated but not activated (no API credentials configured), and there is no disbursement flow, so there is no held figure or settlement schedule to report.",
  },
];
