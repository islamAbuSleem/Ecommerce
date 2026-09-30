export function AdminGuardSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-16"
      aria-label="Loading admin console"
      aria-busy="true"
    >
      <div className="rounded-xl bg-surface-container-lowest p-6 shadow-sm animate-pulse">
        <div className="h-4 w-1/4 rounded bg-surface-container-low" />
        <div className="mt-3 h-9 w-1/2 rounded bg-surface-container-low" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl bg-surface-container-lowest p-5 shadow-sm animate-pulse">
            <div className="h-3 w-1/2 rounded bg-surface-container-low" />
            <div className="mt-3 h-7 w-2/3 rounded bg-surface-container-low" />
            <div className="mt-2 h-3 w-1/3 rounded bg-surface-container-low" />
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl bg-surface-container-lowest p-6 shadow-sm animate-pulse">
        <div className="h-4 w-1/3 rounded bg-surface-container-low" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-surface-container-low" />
          ))}
        </div>
      </div>
    </div>
  );
}
