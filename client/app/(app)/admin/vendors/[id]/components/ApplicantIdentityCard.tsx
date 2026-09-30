import { Icon } from "@/components/ui/components/Icon";
import type { SellerApplicationDetail } from "@/services/admin.service";
import {
  applicantInitials,
  applicantName,
  applicationReference,
  formatCount,
  formatDateTime,
  roleLabel,
} from "../../components/adminConfig";

type Props = {
  application: SellerApplicationDetail;
};

type Field = { label: string; value: string };

export function ApplicantIdentityCard({ application }: Props) {
  const name = applicantName(application);
  const fields: Field[] = [
    { label: "Account role", value: roleLabel(application.role) },
    { label: "Account created", value: formatDateTime(application.createdAt) },
    { label: "Last updated", value: formatDateTime(application.updatedAt) },
    {
      label: "Products on file",
      value: formatCount(application.productCount, "product", "products"),
    },
    {
      label: "Reviewed by",
      value: application.reviewedByName ?? "No reviewer yet",
    },
    {
      label: "Reviewed at",
      value: application.reviewedAt ? formatDateTime(application.reviewedAt) : "Not reviewed",
    },
  ];

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container text-headline-sm text-primary lg:h-14 lg:w-14"
          >
            {applicantInitials(name)}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-headline-sm text-on-surface">{name}</h2>
            <a
              href={`mailto:${application.email}`}
              className="inline-flex min-w-0 items-center gap-1.5 text-caption text-primary transition-colors hover:text-on-primary-fixed-variant"
            >
              <Icon size="xs" aria-hidden="true">mail</Icon>
              <span className="truncate">{application.email}</span>
            </a>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-surface-container px-2.5 py-1 text-label-sm font-semibold text-on-surface-variant">
          {applicationReference(application.id)}
        </span>
      </div>

      <dl className="grid grid-cols-1 gap-x-4 gap-y-3 rounded-lg bg-surface-container-low/70 p-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <div key={field.label} className="min-w-0">
            <dt className="text-caption uppercase tracking-wider text-on-surface-variant">
              {field.label}
            </dt>
            <dd className="truncate text-label-md text-on-surface">{field.value}</dd>
          </div>
        ))}
      </dl>

      <p className="flex items-start gap-2 rounded-lg bg-surface-container-low/40 p-3 text-caption text-on-surface-variant">
        <Icon size="sm" className="mt-0.5 shrink-0 text-primary" aria-hidden="true">info</Icon>
        A seller application only collects an account name, email and role. There is no business
        bio, address, phone or portfolio on file, so there is nothing else to read here.
      </p>
    </section>
  );
}
