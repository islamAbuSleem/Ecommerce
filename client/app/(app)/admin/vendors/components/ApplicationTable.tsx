import Link from "next/link";
import type { SellerApplicationSummary } from "@/services/admin.service";
import {
  applicantInitials,
  applicantName,
  applicationReference,
  formatCount,
  formatDateTime,
  relativeTime,
  roleLabel,
} from "./adminConfig";
import { SellerStatusPill } from "./SellerStatusPill";

type Props = {
  applications: SellerApplicationSummary[];
};

export function ApplicationTable({ applications }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-body-sm text-on-surface">
        <thead>
          <tr className="bg-surface-container-low/60 text-label-sm text-on-surface-variant">
            <th scope="col" className="px-6 py-3 font-medium">
              Applicant
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Reference
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Account
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Applied
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Listings
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              <span className="sr-only">Review</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => {
            const name = applicantName(application);
            return (
              <tr
                key={application.id}
                className="border-t border-border transition-colors hover:bg-surface-container-low/40"
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container text-label-sm text-primary"
                    >
                      {applicantInitials(name)}
                    </span>
                    <div className="min-w-0">
                      <div className="max-w-[200px] truncate font-semibold">{name}</div>
                      <div className="max-w-[200px] truncate text-caption text-on-surface-variant">
                        {application.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-medium text-primary">
                  {applicationReference(application.id)}
                </td>
                <td className="px-4 py-3.5">{roleLabel(application.role)}</td>
                <td className="px-4 py-3.5">
                  <div className="font-medium">{relativeTime(application.createdAt)}</div>
                  <div className="text-caption text-on-surface-variant">
                    {formatDateTime(application.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  {formatCount(application.productCount, "product", "products")}
                </td>
                <td className="px-4 py-3.5">
                  <SellerStatusPill status={application.sellerStatus} />
                </td>
                <td className="px-6 py-3.5 text-right">
                  <Link
                    href={`/admin/vendors/${application.id}`}
                    className="inline-flex shrink-0 items-center rounded-lg bg-primary-fixed px-2.5 py-1.5 text-label-sm font-semibold text-on-primary-fixed-variant transition-colors hover:bg-primary hover:text-on-primary"
                  >
                    Review
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
