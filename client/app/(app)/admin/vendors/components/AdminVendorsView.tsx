"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/components/Icon";
import { ApiError } from "@/services/api";
import {
  adminService,
  type AdminApplicationFilter,
  type SellerApplicationList,
} from "@/services/admin.service";
import { APPLICATION_FILTERS, formatCount, listError } from "./adminConfig";
import { AdminVendorsHeader } from "./AdminVendorsHeader";
import { ApplicationRow } from "./ApplicationRow";
import { ApplicationStatusFilter } from "./ApplicationStatusFilter";
import { ApplicationTable } from "./ApplicationTable";
import { VendorsSkeleton } from "./VendorsSkeleton";

const EMPTY_LIST: SellerApplicationList = { items: [], total: 0 };

export function AdminVendorsView() {
  const [filter, setFilter] = useState<AdminApplicationFilter>("pending");
  const [list, setList] = useState<SellerApplicationList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    adminService
      .sellerApplications(filter)
      .then((next) => {
        if (cancelled) return;
        setList(next);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[admin/vendors]", err);
        setList(null);
        setError(listError(err instanceof ApiError ? err.status : undefined));
      });

    return () => {
      cancelled = true;
    };
  }, [filter, retryKey]);

  const changeFilter = (next: AdminApplicationFilter) => {
    setError(null);
    // Drop the previous filter's rows so we never show one filter's data under
    // another filter's active pill, and so a re-click of the active pill while
    // the request is in error can retry instead of wedging on the skeleton.
    setList(null);
    if (next !== filter) setFilter(next);
    else setRetryKey((key) => key + 1);
  };

  if (!list && !error) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-16">
        <AdminVendorsHeader total={0} filterLabel="Loading" />
        <div className="mt-4">
          <VendorsSkeleton />
        </div>
      </div>
    );
  }

  const data = list ?? EMPTY_LIST;
  const filterLabel = APPLICATION_FILTERS.find((entry) => entry.id === filter)?.label ?? "All";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-16">
      <AdminVendorsHeader total={data.total} filterLabel={filterLabel} />

      <section
        className="mt-4 flex flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm"
        aria-label="Seller application queue"
      >
        <div className="p-5 pb-0 lg:p-6 lg:pb-0">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-headline-sm text-on-surface">Review queue</h2>
              <p className="text-body-sm text-on-surface-variant">
                Applications come from the register form. Every decision is written to the
                applicant&apos;s account and opens or closes their seller dashboard.
              </p>
            </div>
            <span className="shrink-0 text-label-sm text-on-surface-variant">
              {formatCount(data.total, "application", "applications")} in this view
            </span>
          </div>
          <div className="pb-3">
            <ApplicationStatusFilter
              value={filter}
              onChange={changeFilter}
              disabled={!list}
            />
          </div>
        </div>

        {error ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center lg:px-6">
            <Icon size="xl" className="text-outline" aria-hidden="true">error</Icon>
            <p className="text-headline-sm text-on-surface">Queue unavailable</p>
            <p className="max-w-sm text-body-sm text-on-surface-variant">{error}</p>
            <button
              type="button"
              onClick={() => setRetryKey((key) => key + 1)}
              className="mt-1 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
            >
              Try again
            </button>
          </div>
        ) : data.items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center lg:px-6">
            <Icon size="xl" className="text-outline" aria-hidden="true">task_alt</Icon>
            <p className="text-headline-sm text-on-surface">Nothing to review</p>
            <p className="max-w-sm text-body-sm text-on-surface-variant">
              {filter === "pending"
                ? "No applications are waiting on a decision right now."
                : "No applications in this status. Try another filter."}
            </p>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-3 p-4 lg:hidden">
              {data.items.map((application) => (
                <ApplicationRow key={application.id} application={application} />
              ))}
            </ul>
            <div className="hidden lg:block">
              <ApplicationTable applications={data.items} />
            </div>
          </>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 bg-surface-container-low/30 px-4 py-3 lg:px-6">
          <span className="text-caption text-on-surface-variant">
            {error
              ? "Showing nothing"
              : formatCount(data.total, "application", "applications")}
          </span>
          <span className="text-caption text-outline">Outreach emails are not sent from Aura yet</span>
        </div>
      </section>
    </div>
  );
}
