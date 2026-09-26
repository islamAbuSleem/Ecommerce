type Props = {
  page: number;
  totalPages: number;
  total: number;
  count: number;
  onChange: (next: number) => void;
};

export function Pagination({ page, totalPages, total, count, onChange }: Props) {
  return (
    <div className="mt-6 bg-surface-container-lowest rounded-xl shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <span className="text-caption text-on-surface-variant">
        Showing{" "}
        <span className="font-semibold text-on-surface">
          {count} of {total}
        </span>{" "}
        handcrafted objects
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-label-sm flex items-center gap-1 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Previous</span>
        </button>
        <span className="px-2 text-label-sm text-on-surface font-semibold">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container text-label-sm flex items-center gap-1 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <span>Next</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
