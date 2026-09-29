import type { SellerOrder } from "@/services/seller.service";
import {
  formatCurrency,
  formatOrderDate,
  orderItemLine,
  orderQuantity,
  orderReference,
} from "./dashboardConfig";
import { OrderStatusPill } from "./OrderStatusPill";

export function OrderCard({ order }: { order: SellerOrder }) {
  return (
    <li className="flex flex-col gap-2 rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-label-md text-on-surface">{orderReference(order)}</span>
            <span className="text-caption text-on-surface-variant">
              {formatOrderDate(order.createdAt)}
            </span>
          </div>
          <p className="mt-0.5 text-caption text-on-surface-variant">
            {order.itemCount} {order.itemCount === 1 ? "line" : "lines"}
          </p>
        </div>
        <OrderStatusPill status={order.status} />
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-low px-3 py-2">
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-container text-caption font-bold text-on-surface">
            {orderQuantity(order)}x
          </span>
          <span className="truncate text-caption text-on-surface">{orderItemLine(order)}</span>
        </span>
        <span
          className="shrink-0 pl-2 text-label-md text-on-surface"
          title="Your share of this order, excluding other sellers' items"
        >
          {formatCurrency(order.subtotal)}
        </span>
      </div>
    </li>
  );
}
