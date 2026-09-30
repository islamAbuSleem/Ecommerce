import type { AdminApplicationFilter } from "@/services/admin.service";
import { APPLICATION_FILTERS } from "./adminConfig";

type Props = {
  value: AdminApplicationFilter;
  onChange: (filter: AdminApplicationFilter) => void;
  disabled: boolean;
};

export function ApplicationStatusFilter({ value, onChange, disabled }: Props) {
  return (
    <div
      role="group"
      aria-label="Filter applications by review status"
      className="flex items-center gap-2 overflow-x-auto pb-1"
    >
      {APPLICATION_FILTERS.map((entry) => {
        const active = value === entry.id;
        return (
          <button
            key={entry.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(entry.id)}
            disabled={disabled && !active}
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-label-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
              active
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            }`}
          >
            {entry.label}
          </button>
        );
      })}
    </div>
  );
}
