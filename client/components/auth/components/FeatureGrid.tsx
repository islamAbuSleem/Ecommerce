import { Icon } from "@/components/ui/components/Icon";
const FEATURES = [
  {
    icon: "shield",
    title: "100% Escrow",
    caption: "Protected multi-tier patron vaults",
    tint: "bg-primary/10 text-primary",
  },
  {
    icon: "account_balance",
    title: "Direct Studio",
    caption: "Frictionless disbursement on receipt",
    tint: "bg-secondary/10 text-secondary",
  },
  {
    icon: "workspace_premium",
    title: "Verified Origin",
    caption: "Authentic benchcraft lineage record",
    tint: "bg-tertiary-container/10 text-tertiary",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {FEATURES.map(({ icon, title, caption, tint }) => (
        <div key={title} className="flex flex-col gap-2 p-3.5 rounded-lg bg-surface-container-lowest shadow-sm">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tint}`}>
            <Icon size="md">{icon}</Icon>
          </div>
          <span className="text-label-md text-on-surface">{title}</span>
          <span className="text-caption text-on-surface-variant">{caption}</span>
        </div>
      ))}
    </div>
  );
}
