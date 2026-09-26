import { Icon } from "@/components/ui/components/Icon";
const RIBBON: { icon: string; title: string; sub: string; tile: string }[] = [
  {
    icon: "payments",
    title: "100% Maker Share",
    sub: "No predatory cuts or hidden cuts",
    tile: "bg-primary-fixed",
  },
  {
    icon: "eco",
    title: "Carbon-Neutral",
    sub: "Eco-conscious protective boxing",
    tile: "bg-secondary-fixed",
  },
  {
    icon: "verified",
    title: "Studio Provenance",
    sub: "Serialized artisanal authentication",
    tile: "bg-tertiary-fixed",
  },
  {
    icon: "shield_with_heart",
    title: "Escrow Security",
    sub: "Funds release upon safe arrival",
    tile: "bg-surface-container",
  },
];

export function TrustRibbon() {
  return (
    <section aria-label="Marketplace values" className="w-full bg-surface-container-lowest py-6 px-4 sm:px-6 mt-8 rounded-2xl">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {RIBBON.map(({ icon, title, sub, tile }) => (
          <div key={title} className="flex items-center gap-3 rounded-xl p-2">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-primary ${tile}`}
            >
              <Icon size="lg">{icon}</Icon>
            </div>
            <div className="min-w-0">
              <span className="block text-headline-sm text-on-surface">{title}</span>
              <span className="block truncate text-caption text-on-surface-variant">{sub}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
