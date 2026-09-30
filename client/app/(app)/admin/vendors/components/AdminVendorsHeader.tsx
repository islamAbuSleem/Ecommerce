"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/components/Icon";
import { useAuth } from "@/components/auth/AuthContext";
import { formatCount } from "./adminConfig";

type Props = {
  total: number;
  filterLabel: string;
};

export function AdminVendorsHeader({ total, filterLabel }: Props) {
  const { user } = useAuth();

  return (
    <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="hidden items-center gap-1 text-label-sm text-on-surface-variant lg:flex"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Marketplace
            </Link>
            <Icon size="xs" className="text-outline-variant" aria-hidden="true">chevron_right</Icon>
            <span className="font-semibold text-on-surface">Vendor approvals</span>
          </nav>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h1 className="text-headline-sm text-on-surface lg:text-headline-md">
              Seller applications
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-2.5 py-1 text-label-sm font-semibold text-on-surface-variant">
              <Icon size="xs" aria-hidden="true">shield_person</Icon>
              {filterLabel}
            </span>
          </div>
          <p className="mt-1 text-caption text-on-surface-variant">
            {formatCount(total, "application", "applications")} in this view · signed in as{" "}
            {user?.email}
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-lowest px-4 py-2 text-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container-high"
        >
          Browse marketplace
          <Icon size="xs" className="text-on-surface-variant" aria-hidden="true">open_in_new</Icon>
        </Link>
      </div>
    </div>
  );
}
