import Link from "next/link";

export type SpotlightSeller = {
  name: string;
  verified: boolean;
  productCount: number;
  avgRating: number | null;
  initials: string;
};

const ASSURANCES: { icon: string; title: string; sub: string }[] = [
  { icon: "workspace_premium", title: "Batch Inspected", sub: "Seal of Authentication" },
  { icon: "local_shipping", title: "Ships in 48h", sub: "Custom molded pulp wrap" },
  { icon: "token", title: "Provenance Card", sub: "Included in every box" },
];

export function VendorSpotlight({ seller }: { seller: SpotlightSeller | null }) {
  if (!seller) return null;

  return (
    <section
      id="spotlight"
      aria-label="Vendor spotlight"
      className="space-y-4 rounded-2xl bg-surface-container-lowest p-6 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-headline-sm text-primary">
            {seller.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="truncate text-label-md font-semibold text-on-surface">{seller.name}</h3>
              {seller.verified && (
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
              )}
            </div>
            <p className="text-caption text-on-surface-variant">
              {seller.productCount} {seller.productCount === 1 ? "work" : "works"} in the catalog
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-surface-container-high px-2.5 py-1 text-[11px] font-medium text-on-surface-variant">
          Maker of the Month
        </span>
      </div>
      <p className="text-body-sm leading-relaxed text-on-surface-variant">
        A standout studio from this week&apos;s top-rated feed, selected by catalog presence and
        collector ratings. Every piece ships with provenance documentation and escrow protection.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {ASSURANCES.map(({ icon, title, sub }) => (
          <div key={title} className="rounded-xl bg-surface-container-low p-3">
            <span className="material-symbols-outlined mb-1 block text-[20px] text-primary">
              {icon}
            </span>
            <span className="block text-label-sm font-semibold text-on-surface">{title}</span>
            <span className="block text-caption text-on-surface-variant">{sub}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-4 text-caption text-on-surface-variant">
          <div>
            <strong className="block text-label-md text-on-surface">{seller.productCount}</strong>
            <span>Works</span>
          </div>
          <div className="h-6 w-px bg-surface-container-high" />
          <div>
            <strong className="block text-label-md text-on-surface">
              {seller.avgRating != null ? seller.avgRating.toFixed(1) : "–"}
            </strong>
            <span>Rating</span>
          </div>
          <div className="h-6 w-px bg-surface-container-high" />
          <div>
            <strong className="block text-label-md text-on-surface">100%</strong>
            <span>Escrow</span>
          </div>
        </div>
        <Link
          href={`/products?q=${encodeURIComponent(seller.name)}`}
          className="inline-flex items-center gap-1 rounded-lg bg-surface-container-low px-4 py-2 text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
        >
          <span>Storefront</span>
          <span className="material-symbols-outlined text-[16px]">store</span>
        </Link>
      </div>
    </section>
  );
}
