export function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col gap-4 pt-4 lg:pt-6" aria-label="Loading platform analytics">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-8 w-52 animate-pulse rounded bg-surface-container-low" />
            <div className="h-4 w-72 animate-pulse rounded bg-surface-container-low" />
          </div>
          <div className="h-9 w-56 animate-pulse rounded-lg bg-surface-container-low" />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="h-24 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
          <div className="h-24 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
          <div className="h-24 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
          <div className="h-24 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
        </div>
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <div className="h-56 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
            <div className="h-56 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className="h-48 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
            <div className="h-40 animate-pulse rounded-xl bg-surface-container-low shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
