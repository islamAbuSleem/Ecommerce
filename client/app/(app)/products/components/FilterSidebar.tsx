import type { ListParams } from "@/services/products.service";

type Props = {
  activeCategory: string | null;
  activePill: string;
  pills: { id: string; label: string; params: Partial<ListParams> }[];
  tags: { id: string; label: string }[];
  onToggleCategory: (id: string) => void;
  onSelectPill: (id: string) => void;
};

export function FilterSidebar({ activeCategory, activePill, pills, tags, onToggleCategory, onSelectPill }: Props) {
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
                  <span
                    className={`material-symbols-outlined text-[20px] ${active ? "icon-filled" : ""}`}
                  >
                    {active ? "check_box" : "check_box_outline_blank"}
                  </span>
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
                  <span
                    className={`material-symbols-outlined text-[20px] ${active ? "icon-filled" : ""}`}
                  >
                    {active ? "check_box" : "check_box_outline_blank"}
                  </span>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-surface-container-high/60 p-4 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-primary font-semibold text-label-md">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          <span>Provenance Pledge</span>
        </div>
        <p className="text-caption text-on-surface-variant">
          Each artisan&apos;s identity and studio methods are independently vetted before listing.
        </p>
      </div>
    </aside>
  );
}
