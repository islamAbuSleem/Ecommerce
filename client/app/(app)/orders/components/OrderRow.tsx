import Link from "next/link";
import type { Order } from "@/services/orders.service";
import { Icon } from "@/components/ui/components/Icon";
import { OrderStatusPill } from "./OrderStatusPill";
import {
  formatCurrency,
  formatOrderDate,
  lineItemsSummary,
  orderReference,
  totalQuantity,
} from "./ordersConfig";

export function OrderRow({ order }: { order: Order }) {
  const itemCount = totalQuantity(order);

  return (
    <li className="rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-label-md text-on-surface">{orderReference(order)}</span>
              <span className="text-caption text-on-surface-variant">
                {formatOrderDate(order.createdAt)}
              </span>
            </div>
            <p className="mt-0.5 text-caption text-on-surface-variant">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          <OrderStatusPill status={order.status} />
        </div>
        <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-low px-3 py-2">
          <span className="min-w-0 truncate text-caption text-on-surface">{lineItemsSummary(order)}</span>
          <span className="shrink-0 text-label-md text-on-surface">{formatCurrency(order.total)}</span>
        </div>
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center justify-center gap-1 rounded-lg bg-surface-container px-3 py-2 text-label-sm text-on-surface transition-colors hover:bg-surface-container-high"
        >
          View order details
          <Icon size="sm">chevron_right</Icon>
        </Link>
      </div>
    </li>
  );
}
