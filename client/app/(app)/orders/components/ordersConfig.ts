import type { Order } from "@/services/orders.service";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatCurrency(value: number): string {
  return currency.format(value);
}

export function formatOrderDate(value: string | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function orderReference(order: Pick<Order, "id">): string {
  return `#${order.id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function totalQuantity(order: Pick<Order, "items">): number {
  return order.items.reduce((sum, line) => sum + line.qty, 0);
}

export function lineItemsSummary(order: Pick<Order, "items">): string {
  if (order.items.length === 0) return "No line items";
  return order.items.map((line) => `${line.qty}x ${line.name}`).join(", ");
}

export function deliveryMethodLabel(method: Order["deliveryMethod"]): string {
  switch (method) {
    case "express":
      return "Express delivery";
    case "standard":
      return "Standard delivery";
    default:
      return "Delivery";
  }
}

export function normaliseStatus(status: string | null | undefined): string {
  return (status ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

type StatusPill = { label: string; icon: string; chip: string };

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
