import Link from "next/link";

// Static config mirroring the desktop mock taxonomy. Labels are the
// category query values sent to /products (exact-match on the BE).
const CATEGORIES: { label: string; icon: string }[] = [
  { label: "Ceramics", icon: "coffee" },
  { label: "Leather Goods", icon: "wallet" },
  { label: "Desk Tech", icon: "keyboard" },
  { label: "Studio Wood", icon: "chair" },
  { label: "Fine Jewelry", icon: "diamond" },
  { label: "Woven Textile", icon: "texture" },
];

export function CategoryGrid() {
  return (
    <section aria-label="Browse categories" className="w-full py-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="mb-1 block text-label-sm font-semibold tracking-wider text-primary uppercase">
            Artisanal Taxonomy
          </span>
          <h2 className="text-headline-lg text-on-surface">Explore Studios by Craft</h2>
        </div>
        <Link
          href="/products"
          className="flex items-center gap-1 text-label-md text-primary transition-colors hover:text-on-primary-fixed-variant"
        >
          <span>View All Disciplines</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map(({ label, icon }) => (
          <Link
            key={label}
            href={`/products?category=${encodeURIComponent(label)}`}
            className="group flex flex-col items-center text-center rounded-2xl bg-surface-container-lowest p-5 shadow-sm transition-all hover:bg-surface-container-low hover:shadow-md"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container text-on-surface transition-colors group-hover:bg-primary group-hover:text-on-primary">
              <span className="material-symbols-outlined text-[24px]">{icon}</span>
            </div>
            <span className="text-headline-sm text-on-surface transition-colors group-hover:text-primary">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
