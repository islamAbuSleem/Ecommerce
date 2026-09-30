import type { AdminAnalyticsLowStock } from "@/services/admin.service";
import { Icon } from "@/components/ui/components/Icon";
import { formatCurrency, formatInt } from "./dashboardConfig";

export function LowStockWidget({ lowStock }: { lowStock: AdminAnalyticsLowStock }) {
  const { count, outOfStockCount, items } = lowStock;

  return (
    <section className="flex flex-col rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm text-on-surface">Low stock</h2>
        <span className="text-caption text-on-surface-variant">
          {formatInt(count)} low · {formatInt(outOfStockCount)} sold out
        </span>
      </div>
      {items.length === 0 ? (
        <div className="mt-3 flex flex-col items-center gap-2 rounded-lg bg-surface-container-low p-6 text-center">
          <Icon size="lg" className="text-outline" aria-hidden="true">
            inventory_2
          </Icon>
          <p className="text-body-sm text-on-surface-variant">
            All active listings are sufficiently stocked.
          </p>
        </div>
      ) : (
        <ul className="mt-2 flex flex-col divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-tertiary-fixed text-tertiary">
                <Icon size="sm" aria-hidden="true">
                  production_quantity_limits
                </Icon>
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-label-md text-on-surface">{item.name}</p>
                <p className="truncate text-caption text-on-surface-variant">
                  {item.sellerName ?? "Unknown seller"} · {formatCurrency(item.price)}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-tertiary-fixed px-2 py-0.5 text-caption font-semibold text-on-tertiary-fixed-variant">
                {item.stock} left
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
