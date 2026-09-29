import type { SellerOrder } from "@/services/seller.service";
import {
  formatCurrency,
  formatOrderDate,
  orderItemLine,
  orderQuantity,
  orderReference,
} from "./dashboardConfig";
import { OrderStatusPill } from "./OrderStatusPill";

export function OrderTable({ orders }: { orders: SellerOrder[] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-body-sm text-on-surface">
        <thead>
          <tr className="bg-surface-container-low/60 text-label-sm text-on-surface-variant">
            <th scope="col" className="px-6 py-3 font-medium">
              Order &amp; date
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Item(s)
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Your amount
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-t border-border transition-colors hover:bg-surface-container-low/40"
            >
              <td className="px-6 py-3.5">
                <div className="font-semibold text-primary">{orderReference(order)}</div>
                <div className="text-caption text-on-surface-variant">
                  {formatOrderDate(order.createdAt)}
                </div>
              </td>
              <td className="px-4 py-3.5">
                <div className="max-w-[260px] truncate font-medium">{orderItemLine(order)}</div>
                <div className="text-caption text-on-surface-variant">
                  {orderQuantity(order)} units across {order.itemCount}{" "}
                  {order.itemCount === 1 ? "line" : "lines"}
                </div>
              </td>
              <td className="px-4 py-3.5 font-semibold">{formatCurrency(order.subtotal)}</td>
              <td className="px-4 py-3.5">
                <OrderStatusPill status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
