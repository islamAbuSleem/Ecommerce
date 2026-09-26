export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4" aria-label="Loading products">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col bg-surface-container-lowest rounded-xl p-2.5 shadow-sm">
          <div className="w-full aspect-square rounded-lg bg-surface-container-low animate-pulse" />
          <div className="pt-2 space-y-2">
            <div className="h-3 rounded bg-surface-container-low animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-surface-container-low animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-surface-container-low animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
