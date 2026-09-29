import { Icon } from "@/components/ui/components/Icon";
import type { CartItem } from "@/components/cart/CartContext";
import { formatPrice } from "./delivery-methods";

type Props = {
  items: CartItem[];
  subtotal: number;
  shippingLabel: string;
  shippingCost: number;
  total: number;
};

export function OrderSummary({ items, subtotal, shippingLabel, shippingCost, total }: Props) {
  return (
    <section
      aria-label="Order summary"
      className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm"
    >
      <h2 className="text-headline-sm text-on-surface pb-4">Order Summary</h2>
      <ul className="flex flex-col gap-2 pb-2">
        {items.map(({ product, qty }) => (
          <li key={product.id} className="flex items-center justify-between gap-2 text-body-md">
            <span className="truncate text-on-surface-variant">
              {product.name} <span className="text-outline">× {qty}</span>
            </span>
            <span className="shrink-0 text-on-surface font-semibold">
              {formatPrice(product.price * qty)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2.5 pt-2">
        <div className="flex items-center justify-between text-body-md text-on-surface-variant">
          <span>Subtotal ({items.reduce((sum, line) => sum + line.qty, 0)} items)</span>
          <span className="text-on-surface font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-body-md text-on-surface-variant">
          <span>{shippingLabel}</span>
          <span className={`font-semibold ${shippingCost === 0 ? "text-primary" : "text-on-surface"}`}>
            {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
          </span>
        </div>
        <div className="h-px w-full bg-surface-container-high" />
        <div className="flex items-center justify-between">
          <span className="text-label-md text-on-surface">Order Total</span>
          <span className="text-headline-md text-on-surface font-bold">{formatPrice(total)}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-surface-container-low p-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-sm">
          <Icon size="md">verified</Icon>
        </span>
        <div className="min-w-0">
          <p className="text-label-sm text-on-surface font-semibold">Buyer Guarantee</p>
          <p className="text-caption text-on-surface-variant">
            Full refund if the item is not as described.
          </p>
        </div>
      </div>
    </section>
  );
}
