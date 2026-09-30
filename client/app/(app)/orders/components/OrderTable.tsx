import Link from "next/link";
import type { Order } from "@/services/orders.service";
import { Icon } from "@/components/ui/components/Icon";
import { OrderStatusPill } from "./OrderStatusPill";
import {
  formatCurrency,
  formatOrderDate,
  lineItemsSummary,
  orderReference,
} from "./ordersConfig";

export function OrderTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface-container-low/40 text-caption uppercase tracking-wider text-on-surface-variant">
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Placed</th>
            <th className="px-4 py-3 font-medium">Items</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">
              <span className="sr-only">Details</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-border last:border-0 hover:bg-surface-container-low/40">
              <td className="px-4 py-3 text-label-sm text-on-surface">{orderReference(order)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-body-sm text-on-surface-variant">
                {formatOrderDate(order.createdAt)}
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-body-sm text-on-surface">
                {lineItemsSummary(order)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-label-sm text-on-surface">
                {formatCurrency(order.total)}
              </td>
              <td className="px-4 py-3">
                <OrderStatusPill status={order.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex items-center gap-1 text-label-sm text-primary transition-colors hover:text-primary-fixed-variant"
                >
                  Details
                  <Icon size="sm">chevron_right</Icon>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
