import { Icon } from "@/components/ui/components/Icon";

type Props = {
  label: string;
  value: string;
  icon: string;
  iconChip: string;
  caption?: string;
};

export function KpiCard({ label, value, icon, iconChip, caption }: Props) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-caption text-on-surface-variant uppercase tracking-wider">{label}</span>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconChip}`}>
          <Icon size="sm">{icon}</Icon>
        </span>
      </div>
      <div className="mt-2">
        <p className="text-headline-lg text-on-surface tracking-tight">{value}</p>
        {caption ? <p className="mt-0.5 text-caption text-on-surface-variant">{caption}</p> : null}
      </div>
    </div>
  );
}
