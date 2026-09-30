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
 * The design's financial panels describe capabilities Aura has not built. Rather
 * than render a live figure or a green check, each is listed as plainly unavailable.
 */
export const COMMISSION_UNAVAILABLE: { icon: string; title: string; body: string }[] = [
  {
    icon: "account_balance_wallet",
    title: "Net platform commission",
    body: "There is no commission engine yet, so no take-rate or net-earnings figure exists to report.",
  },
  {
    icon: "currency_exchange",
    title: "Payouts & settlements",
    body: "Payments (Stripe, then Razorpay) are not integrated, so there is no disbursement schedule or held figure.",
  },
];
