import { Icon } from "@/components/ui/components/Icon";
import type { AdminSellerStatus } from "@/services/admin.service";
import { sellerStatusPill } from "./adminConfig";

type Props = {
  status: AdminSellerStatus | null;
  size?: "sm" | "md";
};

export function SellerStatusPill({ status, size = "sm" }: Props) {
  const pill = sellerStatusPill(status);
  const compact = size === "sm";

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full font-semibold ${
        compact ? "px-2.5 py-0.5 text-label-sm" : "px-3 py-1 text-label-md"
      } ${pill.chip}`}
    >
      {pill.dot ? (
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${pill.dot}`} aria-hidden="true" />
      ) : (
        <Icon size="xs" aria-hidden="true">{pill.icon}</Icon>
      )}
      <span className="truncate">{pill.label}</span>
    </span>
  );
}
