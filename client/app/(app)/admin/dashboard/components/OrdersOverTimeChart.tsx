import type { AdminAnalyticsSeriesPoint } from "@/services/admin.service";
import { formatCurrency, formatInt } from "./dashboardConfig";

type Props = {
  series: AdminAnalyticsSeriesPoint[];
  label: string;
};

export function OrdersOverTimeChart({ series, label }: Props) {
  const maxOrders = series.reduce((max, point) => Math.max(max, point.orders), 0);
  const totalOrders = series.reduce((sum, point) => sum + point.orders, 0);
  const totalGmv = series.reduce((sum, point) => sum + point.gmv, 0);
  const first = series[0];
  const last = series[series.length - 1];

  return (
    <section className="flex flex-col rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm text-on-surface">Orders over time</h2>
        <span className="text-caption text-on-surface-variant">{label}</span>
      </div>

      <div
        className="mt-4 flex h-32 items-end gap-px"
        role="img"
        aria-label={`${label}: ${formatInt(totalOrders)} orders, ${formatCurrency(totalGmv)} in gross sales`}
      >
        {series.map((point) => {
          const heightPct =
            maxOrders > 0 ? Math.max((point.orders / maxOrders) * 100, point.orders > 0 ? 6 : 0) : 0;
          return (
            <div
              key={point.day}
              className="flex h-full flex-1 items-end"
              title={`${point.day} — ${point.orders} orders, ${formatCurrency(point.gmv)}`}
            >
              <div
                className={`w-full rounded-t ${point.orders > 0 ? "bg-primary" : "bg-surface-container"}`}
                style={{ height: `${heightPct}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-caption text-on-surface-variant">
        <span>{first?.day}</span>
        <span>{last?.day}</span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-body-sm text-on-surface-variant">
          {formatInt(totalOrders)} orders · {label}
        </span>
        <span className="text-label-md text-on-surface">{formatCurrency(totalGmv)}</span>
      </div>
    </section>
  );
}
