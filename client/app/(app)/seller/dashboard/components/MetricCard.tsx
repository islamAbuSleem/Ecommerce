import { Icon } from "@/components/ui/components/Icon";

type Props = {
  label: string;
  value: string;
  icon: string;
  iconChip: string;
  caption: string;
};

export function MetricCard({ label, value, icon, iconChip, caption }: Props) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">{label}</span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconChip}`}
        >
          <Icon size="md" aria-hidden="true">{icon}</Icon>
        </span>
      </div>
      <div className="mt-2">
        <div className="text-display-lg-mobile text-on-surface lg:text-display-lg">{value}</div>
        <p className="mt-1 text-caption text-on-surface-variant">{caption}</p>
      </div>
    </div>
  );
}
