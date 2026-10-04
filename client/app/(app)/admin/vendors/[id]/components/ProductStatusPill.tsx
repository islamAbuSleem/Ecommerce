import { Icon } from "@/components/ui/components/Icon";
import { productStatusPill } from "../../components/adminConfig";

type Props = {
  status: string;
};

export function ProductStatusPill({ status }: Props) {
  const pill = productStatusPill(status);

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${pill.chip}`}
    >
      <Icon size="xs" aria-hidden="true">{pill.icon}</Icon>
      <span className="truncate">{pill.label}</span>
    </span>
  );
}
