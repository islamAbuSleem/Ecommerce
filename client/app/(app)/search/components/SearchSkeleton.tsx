export function SearchSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col gap-4 pt-4 lg:pt-6" aria-label="Loading search results">
        <div className="h-8 w-64 animate-pulse rounded bg-surface-container-low" />
        <div className="h-10 w-full max-w-xl animate-pulse rounded-lg bg-surface-container-low" />
        <div className="h-44 animate-pulse rounded-xl bg-surface-container-lowest shadow-sm" />
      </div>
    </div>
  );
}
