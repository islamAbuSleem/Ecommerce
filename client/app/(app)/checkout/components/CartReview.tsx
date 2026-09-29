import Image from "next/image";
import { Icon } from "@/components/ui/components/Icon";
import type { CartItem } from "@/components/cart/CartContext";
import { formatPrice } from "./delivery-methods";

type Props = {
  items: CartItem[];
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
};

export function CartReview({ items, onUpdateQty, onRemove }: Props) {
  const total = items.reduce((sum, line) => sum + line.qty * line.product.price, 0);

  return (
    <section
      aria-label="Order items"
      className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Icon size="md" className="text-primary">
            shopping_bag
          </Icon>
          <h2 className="text-headline-sm text-on-surface">Order Items ({items.length})</h2>
        </div>
        <span className="text-label-md text-primary">{formatPrice(total)}</span>
      </div>
      <ul className="flex flex-col gap-3 pt-1">
        {items.map(({ product, qty }) => (
          <li
            key={product.id}
            className="relative flex items-start gap-3 bg-surface-container-low p-2.5 rounded-xl"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center">
                  <Icon size="lg" className="text-outline">
                    image
                  </Icon>
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="mb-1 inline-block rounded-full bg-surface-container-highest px-2 py-0.5 text-caption text-on-surface-variant">
                Seller: {product.seller?.fullName ?? "Independent maker"}
              </span>
              <h3 className="truncate text-label-md text-on-surface">{product.name}</h3>
              <p className="mt-0.5 text-caption text-on-surface-variant">
                {formatPrice(product.price)} each
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="flex items-center rounded-lg bg-surface-container-lowest p-1">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${product.name}`}
                    onClick={() => onUpdateQty(product.id, qty - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded text-on-surface transition-colors hover:bg-surface-container-low"
                  >
                    <Icon size="sm">remove</Icon>
                  </button>
                  <span className="w-8 text-center text-label-md text-on-surface select-none">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${product.name}`}
                    disabled={qty >= product.stock}
                    onClick={() => onUpdateQty(product.id, Math.min(product.stock, qty + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded text-on-surface transition-colors hover:bg-surface-container-low disabled:opacity-40"
                  >
                    <Icon size="sm">add</Icon>
                  </button>
                </div>
                <span className="text-label-md text-on-surface">
                  {formatPrice(product.price * qty)}
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label={`Remove ${product.name}`}
              onClick={() => onRemove(product.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-outline transition-colors hover:bg-error-container hover:text-error"
            >
              <Icon size="md">delete</Icon>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
