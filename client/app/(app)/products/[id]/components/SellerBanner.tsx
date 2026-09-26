import type { Product } from "@/services/products.service";
import { isVerifiedSeller } from "@/components/products/sellers";
import { Icon } from "@/components/ui/components/Icon";

function sellerInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SellerBanner({ product }: { product: Product }) {
  const name = product.seller?.fullName ?? "Independent maker";
  const verified = isVerifiedSeller(product.seller?.sellerStatus);
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary text-headline-sm shrink-0">
          {sellerInitials(product.seller?.fullName)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-label-md text-on-surface truncate">{name}</span>
            {verified && (
              <Icon size="sm" filled className="text-primary shrink-0">
                check_circle
              </Icon>
            )}
          </div>
          <p className="text-caption text-outline truncate">
            {verified ? "Verified seller" : "Marketplace seller"}
          </p>
        </div>
      </div>
      {product.freeShipping && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-label-sm shrink-0">
          <Icon size="sm" className="text-secondary">local_shipping</Icon>
          Free shipping
        </span>
      )}
    </div>
  );
}
