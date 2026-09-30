export function OrdersGuardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col gap-4 pt-4 lg:pt-6" aria-label="Loading your orders">
        <div className="h-8 w-56 animate-pulse rounded bg-surface-container-low" />
        <div className="h-4 w-72 animate-pulse rounded bg-surface-container-low" />
        <div className="h-24 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
        <div className="h-24 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
      </div>
    </div>
  );
}
