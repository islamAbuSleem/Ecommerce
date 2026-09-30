import type { AdminAnalyticsCategory } from "@/services/admin.service";
import { CHART_COLORS, formatCurrency, formatInt } from "./dashboardConfig";

export function CategoryGmvBar({ categories }: { categories: AdminAnalyticsCategory[] }) {
  if (categories.length === 0) {
    return (
      <section className="flex flex-col rounded-xl bg-surface-container-lowest p-4 shadow-sm">
        <h2 className="text-headline-sm text-on-surface">GMV by category</h2>
        <p className="mt-2 text-body-sm text-on-surface-variant">
          No orders yet, so there is no category breakdown to show.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <h2 className="text-headline-sm text-on-surface">GMV by category</h2>
      <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
        {categories.map((entry, index) => (
          <div
            key={entry.category}
            className={CHART_COLORS[index % CHART_COLORS.length]}
            style={{ width: `${Math.max(entry.share, 0)}%` }}
            title={`${entry.category} ${entry.share}%`}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {categories.map((entry, index) => (
          <li key={entry.category} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${CHART_COLORS[index % CHART_COLORS.length]}`}
              />
              <span className="truncate text-body-sm text-on-surface">{entry.category}</span>
              <span className="shrink-0 text-caption text-on-surface-variant">
                {formatInt(entry.units)} units
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="text-label-md text-on-surface">{formatCurrency(entry.gmv)}</span>
              <span className="block text-caption text-on-surface-variant">{entry.share}% of GMV</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
