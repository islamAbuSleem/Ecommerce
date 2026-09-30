import { Icon } from "@/components/ui/components/Icon";

export function TrackingPlaceholder() {
  return (
    <section className="mt-4 overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="flex items-start gap-3 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-outline">
          <Icon size="lg">local_shipping</Icon>
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-headline-sm text-on-surface">Carrier tracking not set up yet</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Your order is confirmed and awaiting dispatch. Live carrier tracking and delivery
            milestones will appear here once shipping is integrated.
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-surface-container px-2.5 py-1 text-caption text-on-surface-variant">
            <span className="h-1.5 w-1.5 rounded-full bg-outline" />
            Tracking coming soon
          </span>
        </div>
      </div>
    </section>
  );
}
