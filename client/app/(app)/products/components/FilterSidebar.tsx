import type { ListParams } from "@/services/products.service";
import { Icon } from "@/components/ui/components/Icon";

export const MAX_PRICE_LIMIT = 1000;
const PRICE_STEP = 10;

type Props = {
  activeCategory: string | null;
  activePill: string;
  pills: { id: string; label: string; params: Partial<ListParams> }[];
  tags: { id: string; label: string }[];
  maxPrice: number | null;
  onMaxPrice: (value: number | null) => void;
  onToggleCategory: (id: string) => void;
  onSelectPill: (id: string) => void;
};

export function FilterSidebar({ activeCategory, activePill, pills, tags, maxPrice, onMaxPrice, onToggleCategory, onSelectPill }: Props) {
  return (
    <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 space-y-4">
      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm space-y-3">
        <span className="text-headline-sm text-on-surface">Categories</span>
        <div className="space-y-2 text-body-sm">
          {tags.map(({ id, label }) => {
            const active = activeCategory === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggleCategory(id)}
                aria-pressed={active}
                className="flex items-center justify-between w-full group cursor-pointer"
              >
                <span
                  className={`flex items-center gap-2 ${
                    active ? "text-primary font-semibold" : "text-on-surface-variant group-hover:text-on-surface"
                  }`}
                >
                  <Icon size="md" filled={active} aria-hidden="true">
                    {active ? "check_box" : "check_box_outline_blank"}
                  </Icon>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm space-y-3">
        <span className="text-headline-sm text-on-surface">Refine</span>
        <div className="space-y-2 text-body-sm">
          {pills.filter((p) => p.id !== "all").map(({ id, label }) => {
            const active = activePill === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelectPill(active ? "all" : id)}
                aria-pressed={active}
                className="flex items-center justify-between w-full group cursor-pointer"
              >
                <span
                  className={`flex items-center gap-2 ${
                    active ? "text-primary font-semibold" : "text-on-surface-variant group-hover:text-on-surface"
                  }`}
                >
                  <Icon size="md" filled={active} aria-hidden="true">
                    {active ? "check_box" : "check_box_outline_blank"}
                  </Icon>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-headline-sm text-on-surface">Max price</span>
          <span aria-live="polite" className="text-label-sm text-on-surface-variant">
            {maxPrice == null ? "Any price" : `Up to $${maxPrice}`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={MAX_PRICE_LIMIT}
          step={PRICE_STEP}
          value={maxPrice ?? MAX_PRICE_LIMIT}
          onChange={(e) => {
            const next = Number(e.target.value);
            onMaxPrice(next >= MAX_PRICE_LIMIT ? null : next);
          }}
          aria-label="Maximum price"
          aria-valuetext={maxPrice == null ? "Any price" : `Up to $${maxPrice}`}
          className="w-full accent-primary cursor-pointer"
        />
        {maxPrice != null && (
          <button
            type="button"
            onClick={() => onMaxPrice(null)}
            className="text-label-sm text-primary hover:text-on-primary-fixed-variant font-semibold underline underline-offset-2"
          >
            Clear price filter
          </button>
        )}
      </div>

      <div className="bg-surface-container-high/60 p-4 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-primary font-semibold text-label-md">
          <Icon size="md" aria-hidden="true">verified_user</Icon>
          <span>Provenance Pledge</span>
        </div>
        <p className="text-caption text-on-surface-variant">
          Each artisan&apos;s identity and studio methods are independently vetted before listing.
        </p>
      </div>
    </aside>
  );
}
