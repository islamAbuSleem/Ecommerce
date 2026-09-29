import Link from "next/link";
import { Icon } from "@/components/ui/components/Icon";
import {
  NEUTRAL_SELLER_STATUS_COPY,
  SELLER_STATUS_COPY,
  type SellerStatusCopy,
} from "../dashboard/components/dashboardConfig";

export function SellerPendingState({ status }: { status: string | null }) {
  const copy: SellerStatusCopy = (status && SELLER_STATUS_COPY[status]) || NEUTRAL_SELLER_STATUS_COPY;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-16">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
          <Icon size="lg" aria-hidden="true">{copy.icon}</Icon>
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-sm font-semibold ${copy.chip}`}
        >
          <Icon size="xs" aria-hidden="true">shield</Icon>
          {copy.label}
        </span>
        <h1 className="text-headline-md text-on-surface">{copy.title}</h1>
        <p className="max-w-md text-body-md text-on-surface-variant">{copy.body}</p>
        <Link
          href="/products"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-surface-container px-4 py-2 text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
        >
          <Icon size="sm" aria-hidden="true">storefront</Icon>
          Browse the marketplace
        </Link>
      </div>
    </div>
  );
}
