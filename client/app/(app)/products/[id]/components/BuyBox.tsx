import type { Product } from "@/services/products.service";
import { RatingStars } from "@/components/products/components/RatingStars";
import { isVerifiedSeller } from "@/components/products/sellers";
import { Icon } from "@/components/ui/components/Icon";

type Props = {
  product: Product;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
};

export function BuyBox({ product, quantity, setQuantity }: Props) {
  const inStock = (product?.stock ?? 0) > 0;
  const lowStock = product != null && product.stock > 0 && product.stock <= 5;

  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        {product.seller && isVerifiedSeller(product.seller.sellerStatus) ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container text-primary text-label-sm">
            <Icon size="sm" filled>
              verified
            </Icon>
            Verified Seller
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant text-label-sm">
            {product.category}
          </span>
        )}
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-label-sm ${
            inStock ? "bg-success-lightest text-success-foreground" : "bg-error-container text-on-error-container"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {inStock ? (lowStock ? `Only ${product.stock} left` : "In Stock") : "Out of stock"}
        </span>
      </div>

      <div>
        <h1 className="text-headline-md lg:text-headline-lg text-on-surface tracking-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 mt-1.5">
          <RatingStars value={product.ratingAvg} />
          <span className="text-label-md text-on-surface">{product.ratingAvg.toFixed(1)}</span>
          <span className="text-outline text-body-sm">•</span>
          <span className="text-label-sm text-on-surface-variant">
            {product.ratingCount} {product.ratingCount === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>

      <div className="flex items-baseline gap-2.5">
        <span className="text-headline-lg text-on-surface tracking-tight">
          ${product.price.toFixed(2)}
        </span>
        {product.freeShipping && (
          <span className="text-caption text-secondary font-medium">Free shipping</span>
        )}
      </div>

      <div className="h-px bg-surface-container-high w-full" />

      {/* Quantity stepper (visual only) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-surface-container-low rounded-lg p-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={!inStock}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors disabled:opacity-40"
          >
            <Icon size="md">remove</Icon>
          </button>
          <span className="text-headline-sm text-on-surface w-10 text-center">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={!inStock}
            onClick={() => setQuantity((q) => Math.min(product.stock > 0 ? product.stock : 1, q + 1))}
            className="w-8 h-8 rounded flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors disabled:opacity-40"
          >
            <Icon size="md">add</Icon>
          </button>
        </div>
        <span className="text-caption text-outline">
          {product.stock} available
        </span>
      </div>

      <button
        type="button"
        disabled
        title="Checkout is coming soon"
        className="w-full h-11 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-label-md flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
      >
        <Icon size="md">shopping_bag</Icon>
        <span>Available soon</span>
      </button>

      <div className="bg-surface-container-low rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-start gap-2.5">
          <Icon size="md" className="text-primary shrink-0 mt-0.5">
            verified_user
          </Icon>
          <div>
            <p className="text-label-sm text-on-surface">Buyer Protection</p>
            <p className="text-caption text-outline">30-day hassle-free returns</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Icon size="md" className="text-primary shrink-0 mt-0.5">
            local_shipping
          </Icon>
          <div>
            <p className="text-label-sm text-on-surface">Insured Delivery</p>
            <p className="text-caption text-outline">
              {product.freeShipping ? "Free carbon-neutral shipping" : "Tracked shipping at checkout"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
