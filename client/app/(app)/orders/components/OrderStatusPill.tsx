import { Icon } from "@/components/ui/components/Icon";
import { humanStatus, statusPill } from "./ordersConfig";

export function OrderStatusPill({ status }: { status: string }) {
  const pill = statusPill(status);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-label-sm font-semibold ${pill.chip}`}
    >
      <Icon size="xs" aria-hidden="true">{pill.icon}</Icon>
      {pill.label === "Unknown" ? humanStatus(status) : pill.label}
    </span>
  );
}
