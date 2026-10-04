export function VendorsSkeleton() {
  return (
    <div
      className="rounded-xl bg-surface-container-lowest p-5 shadow-sm lg:p-6"
      aria-label="Loading seller applications"
      aria-busy="true"
    >
      <div className="h-4 w-1/3 rounded bg-surface-container-low" />
      <div className="mt-2 h-3 w-1/4 rounded bg-surface-container-low" />
      <div className="mt-4 flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-24 shrink-0 rounded-lg bg-surface-container-low" />
        ))}
      </div>
      <ul className="mt-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="h-24 rounded-xl bg-surface-container-low/50" />
        ))}
      </ul>
    </div>
  );
}
