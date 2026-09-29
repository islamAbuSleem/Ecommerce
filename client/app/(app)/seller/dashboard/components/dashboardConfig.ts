import type { SellerOrder, SellerRange, SellerStatusCounts } from "@/services/seller.service";

export const RANGE_OPTIONS: { id: SellerRange; label: string }[] = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
  { id: "all", label: "All time" },
];

export function rangeLabel(range: SellerRange): string {
  return RANGE_OPTIONS.find((option) => option.id === range)?.label ?? "All time";
}

const DISPATCHED = new Set(["shipped", "in_transit", "out_for_delivery"]);
const CANCELLED = new Set(["cancelled", "canceled", "refunded"]);

export type OrderFilterId = "all" | "to_ship" | "in_transit" | "delivered" | "cancelled";

/**
 * Every status string is funnelled through here before it reaches a pill lookup or a
 * filter predicate, so `" Pending"`, `"PENDING"` and `"in transit"` all resolve the same way.
 */
export function normaliseStatus(status: string | null | undefined): string {
  return (status ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

export const ORDER_FILTERS: {
  id: OrderFilterId;
  label: string;
  match: (status: string) => boolean;
}[] = [
  { id: "all", label: "All Orders", match: () => true },
  {
    id: "to_ship",
    label: "To Ship",
    match: (status) => {
      const key = normaliseStatus(status);
      return !DISPATCHED.has(key) && !CANCELLED.has(key);
    },
  },
  { id: "in_transit", label: "In Transit", match: (status) => DISPATCHED.has(normaliseStatus(status)) },
  { id: "delivered", label: "Delivered", match: (status) => normaliseStatus(status) === "delivered" },
  { id: "cancelled", label: "Cancelled", match: (status) => CANCELLED.has(normaliseStatus(status)) },
];

type StatusPill = { label: string; icon: string; chip: string };

/**
 * Only states the platform can actually emit today. The order machine writes `pending`
 * on checkout; nothing advances it yet, so pills for later states would be fiction.
 */
const KNOWN_PILLS: Record<string, StatusPill> = {
  pending: { label: "Pending", icon: "hourglass_top", chip: "bg-surface-container-high text-on-surface" },
};

const FALLBACK_PILL: StatusPill = {
  label: "Unknown",
  icon: "help",
  chip: "bg-surface-container text-on-surface-variant",
};

export function statusPill(status: string): StatusPill {
  return KNOWN_PILLS[normaliseStatus(status)] ?? FALLBACK_PILL;
}

export function humanStatus(status: string): string {
  const key = normaliseStatus(status).replace(/_/g, " ");
  if (!key) return "Unknown";
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function orderReference(order: SellerOrder): string {
  return `#${order.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function orderQuantity(order: SellerOrder): number {
  return order.items.reduce((sum, line) => sum + line.qty, 0);
}

export function orderItemLine(order: SellerOrder): string {
  if (order.items.length === 0) return "No line items";
  return order.items.map((line) => `${line.qty}x ${line.name}`).join(", ");
}

function sumStatusCounts(counts: SellerStatusCounts | undefined, match: (status: string) => boolean): number {
  if (!counts) return 0;
  let total = 0;
  for (const [status, count] of Object.entries(counts)) {
    if (match(status)) total += count;
  }
  return total;
}

/** Server-side count for a filter, summed across every status the filter matches. */
export function filterCount(
  counts: SellerStatusCounts | undefined,
  filterId: OrderFilterId,
): number {
  if (filterId === "all") {
    if (!counts) return 0;
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  }
  const filter = ORDER_FILTERS.find((entry) => entry.id === filterId);
  if (!filter) return 0;
  return sumStatusCounts(counts, filter.match);
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatCurrency(value: number): string {
  return currency.format(value);
}

export function formatOrderDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatCount(value: number, singular: string, plural: string): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

export type SellerStatusCopy = {
  label: string;
  icon: string;
  chip: string;
  title: string;
  body: string;
};

export const SELLER_STATUS_COPY: Record<string, SellerStatusCopy> = {
  pending: {
    label: "Pending approval",
    icon: "hourglass_top",
    chip: "bg-info-lightest text-info-foreground",
    title: "Your seller application is under review",
    body: "A marketplace admin has to approve every studio before it can list work. You will be able to open your dashboard as soon as that is done. Nothing to do here in the meantime.",
  },
  rejected: {
    label: "Not approved",
    icon: "block",
    chip: "bg-error-container text-on-error-container",
    title: "Your seller application was not approved",
    body: "An admin reviewed your application and turned it down. If you think that was a mistake, contact the marketplace team and ask for a re-review.",
  },
};

export const NEUTRAL_SELLER_STATUS_COPY: SellerStatusCopy = {
  label: "Not submitted",
  icon: "storefront",
  chip: "bg-surface-container text-on-surface-variant",
  title: "You don't have a seller profile yet",
  body: "Nothing is being reviewed at the moment. Apply to become a seller and your studio dashboard opens as soon as an admin approves the application.",
};
