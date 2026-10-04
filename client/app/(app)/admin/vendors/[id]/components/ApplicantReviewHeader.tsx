import Link from "next/link";
import { Icon } from "@/components/ui/components/Icon";
import type { SellerApplicationDetail } from "@/services/admin.service";
import {
  applicantInitials,
  applicantName,
  applicationReference,
  formatCount,
  relativeTime,
} from "../../components/adminConfig";
import { SellerStatusPill } from "../../components/SellerStatusPill";

type Props = {
  application: SellerApplicationDetail;
};

export function ApplicantReviewHeader({ application }: Props) {
  const name = applicantName(application);

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:p-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-label-sm text-on-surface-variant"
      >
        <Link href="/admin/vendors" className="transition-colors hover:text-primary">
          Admin console
        </Link>
        <Icon size="xs" className="text-outline-variant" aria-hidden="true">chevron_right</Icon>
        <Link href="/admin/vendors" className="transition-colors hover:text-primary">
          Vendor approvals
        </Link>
        <Icon size="xs" className="text-outline-variant" aria-hidden="true">chevron_right</Icon>
        <span className="font-semibold text-on-surface">{name}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container text-headline-sm text-primary lg:h-14 lg:w-14"
          >
            {applicantInitials(name)}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-headline-sm text-on-surface lg:text-headline-md">
              {name}
            </h1>
            <p className="truncate text-caption text-on-surface-variant">
              {application.email} · {applicationReference(application.id)} · applied{" "}
              {relativeTime(application.createdAt)}
            </p>
            <p className="mt-0.5 truncate text-caption text-outline">
              {formatCount(application.productCount, "product", "products")} already listed
            </p>
          </div>
        </div>
        <SellerStatusPill status={application.sellerStatus} size="md" />
      </div>
    </div>
  );
}
