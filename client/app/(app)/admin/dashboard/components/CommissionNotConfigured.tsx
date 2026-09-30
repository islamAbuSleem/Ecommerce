import { Icon } from "@/components/ui/components/Icon";
import { COMMISSION_UNAVAILABLE } from "./dashboardConfig";

export function CommissionNotConfigured() {
  return (
    <section className="flex flex-col rounded-xl bg-surface-container-low/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm text-on-surface">Commission & payouts</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-2.5 py-0.5 text-caption text-on-surface-variant">
          <span className="h-1.5 w-1.5 rounded-full bg-outline" />
          Not configured
        </span>
      </div>
      <ul className="mt-3 flex flex-col gap-3">
        {COMMISSION_UNAVAILABLE.map((item) => (
          <li key={item.title} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container text-outline">
              <Icon size="sm" aria-hidden="true">
                {item.icon}
              </Icon>
            </span>
            <div className="min-w-0">
              <p className="text-label-md text-on-surface">{item.title}</p>
              <p className="mt-0.5 text-body-sm text-on-surface-variant">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
