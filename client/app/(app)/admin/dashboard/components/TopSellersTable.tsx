import type { AdminAnalyticsTopSeller } from "@/services/admin.service";
import { formatCurrency, formatInt, sellerDisplayName } from "./dashboardConfig";

export function TopSellersTable({ sellers }: { sellers: AdminAnalyticsTopSeller[] }) {
  if (sellers.length === 0) {
    return (
      <section className="flex flex-col rounded-xl bg-surface-container-lowest p-4 shadow-sm">
        <h2 className="text-headline-sm text-on-surface">Top sellers by GMV</h2>
        <p className="mt-2 text-body-sm text-on-surface-variant">No seller sales in this period yet.</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <h2 className="text-headline-sm text-on-surface">Top sellers by GMV</h2>
      <ul className="mt-2 flex flex-col divide-y divide-border">
        {sellers.map((seller, index) => (
          <li key={seller.sellerId} className="flex items-center gap-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container text-caption font-bold text-on-surface">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-label-md text-on-surface">
                {sellerDisplayName(seller.name, "Unnamed seller")}
              </p>
              <p className="text-caption text-on-surface-variant">
                {formatInt(seller.orders)} {seller.orders === 1 ? "order" : "orders"}
              </p>
            </div>
            <span className="shrink-0 text-label-md text-on-surface">{formatCurrency(seller.gmv)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
