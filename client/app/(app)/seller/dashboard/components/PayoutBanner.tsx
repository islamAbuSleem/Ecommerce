import { Icon } from "@/components/ui/components/Icon";

export function PayoutBanner() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-5 shadow-sm lg:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary shadow-sm">
            <Icon size="xl" aria-hidden="true">account_balance_wallet</Icon>
          </span>
          <div className="min-w-0">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
              Settlements
            </span>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
              <span className="text-headline-lg text-on-surface">Not connected</span>
              <span className="rounded-full bg-surface-container px-2 py-0.5 text-label-sm font-semibold text-on-surface-variant">
                No payout account
              </span>
            </div>
            <p className="mt-1 max-w-lg text-body-sm text-on-surface-variant">
              Aura does not move money yet. There is no Stripe Connect account behind this studio, so
              there is no available balance, no transfer schedule, and no bank on file. Your net
              earnings below are gross marketplace figures, not a payable amount.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            disabled
            title="Payouts are not connected yet"
            className="inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary opacity-50 transition-all"
          >
            <Icon size="sm" aria-hidden="true">bolt</Icon>
            Instant transfer unavailable
          </button>
          <button
            type="button"
            disabled
            title="Payouts are not connected yet"
            className="inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-lg bg-surface-container-low px-4 py-2 text-label-md text-on-surface opacity-50 transition-all"
          >
            <Icon size="sm" aria-hidden="true">tune</Icon>
            Bank settings unavailable
          </button>
        </div>
      </div>
    </section>
  );
}
