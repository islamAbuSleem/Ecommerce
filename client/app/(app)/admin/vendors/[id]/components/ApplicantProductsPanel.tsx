import { Icon } from "@/components/ui/components/Icon";
import type { SellerApplicationDetail } from "@/services/admin.service";
import {
  applicantName,
  categoryIcon,
  formatCount,
  formatCurrency,
} from "../../components/adminConfig";
import { ProductStatusPill } from "./ProductStatusPill";

type Props = {
  application: SellerApplicationDetail;
};

export function ApplicantProductsPanel({ application }: Props) {
  const products = application.products;
  const owner = applicantName(application);

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-headline-sm text-on-surface">Catalog on file</h2>
          <p className="text-caption text-on-surface-variant">
            Everything {owner} has already listed on the marketplace.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container px-2.5 py-1 text-label-sm font-semibold text-on-surface-variant">
          <Icon size="xs" aria-hidden="true">inventory_2</Icon>
          {formatCount(products.length, "item", "items")}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg bg-surface-container-low/50 px-4 py-8 text-center">
          <Icon size="lg" className="text-outline" aria-hidden="true">inventory_2</Icon>
          <p className="text-body-sm text-on-surface-variant">
            No products on this account yet. An approved seller can list from their own dashboard.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center gap-3 rounded-lg bg-surface-container-low/50 p-3 transition-colors hover:bg-surface-container-low"
            >
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary"
              >
                <Icon size="lg" aria-hidden="true">{categoryIcon(product.category)}</Icon>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                  <p className="min-w-0 text-label-md text-on-surface">{product.name}</p>
                  <span className="shrink-0 text-label-md text-on-surface">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption text-on-surface-variant">
                  <span className="truncate">{product.category ?? "No category"}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatCount(product.stock, "unit", "units")} in stock</span>
                </div>
              </div>
              <div className="shrink-0">
                <ProductStatusPill status={product.status} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="flex items-start gap-2 rounded-lg bg-surface-container-low/40 p-3 text-caption text-on-surface-variant">
        <Icon size="sm" className="mt-0.5 shrink-0 text-primary" aria-hidden="true">percent</Icon>
        Prices above are the seller&apos;s own list prices. Aura deducts no commission yet, so
        there is no platform cut and no net figure to show.
      </p>
    </section>
  );
}
