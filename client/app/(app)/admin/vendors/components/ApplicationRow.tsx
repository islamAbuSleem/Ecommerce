import Link from "next/link";
import { Icon } from "@/components/ui/components/Icon";
import type { SellerApplicationSummary } from "@/services/admin.service";
import {
  applicantInitials,
  applicantName,
  applicationReference,
  formatCount,
  relativeTime,
  roleLabel,
} from "./adminConfig";
import { SellerStatusPill } from "./SellerStatusPill";

type Props = {
  application: SellerApplicationSummary;
};

export function ApplicationRow({ application }: Props) {
  const name = applicantName(application);

  return (
    <li className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-container text-label-md text-primary"
          >
            {applicantInitials(name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-label-md text-on-surface">{name}</p>
            <p className="truncate text-caption text-on-surface-variant">{application.email}</p>
          </div>
        </div>
        <div className="shrink-0">
          <SellerStatusPill status={application.sellerStatus} />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-lg bg-surface-container-low/50 p-3 sm:grid-cols-4">
        <div className="min-w-0">
          <dt className="text-caption text-on-surface-variant">Reference</dt>
          <dd className="truncate text-label-sm text-on-surface">
            {applicationReference(application.id)}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-caption text-on-surface-variant">Account</dt>
          <dd className="truncate text-label-sm text-on-surface">{roleLabel(application.role)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-caption text-on-surface-variant">Applied</dt>
          <dd className="truncate text-label-sm text-on-surface">
            {relativeTime(application.createdAt)}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-caption text-on-surface-variant">Listings</dt>
          <dd className="truncate text-label-sm text-on-surface">
            {formatCount(application.productCount, "product", "products")}
          </dd>
        </div>
      </dl>

      <Link
        href={`/admin/vendors/${application.id}`}
        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-container"
      >
        Review application
        <Icon size="xs" aria-hidden="true">arrow_forward</Icon>
      </Link>
    </li>
  );
}
