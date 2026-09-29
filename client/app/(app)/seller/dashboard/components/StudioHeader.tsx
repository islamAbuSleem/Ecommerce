"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { Icon } from "@/components/ui/components/Icon";

export function StudioHeader() {
  const { user } = useAuth();
  const studioName = user?.fullName || user?.email || "Your studio";

  return (
    <div className="rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="hidden items-center gap-1 text-label-sm text-on-surface-variant lg:flex"
          >
            <Link href="/seller/dashboard" className="transition-colors hover:text-primary">
              Seller Studio
            </Link>
            <Icon size="xs" className="text-outline-variant" aria-hidden="true">chevron_right</Icon>
            <span className="font-semibold text-on-surface">Dashboard</span>
          </nav>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-surface-container-lowest px-3 py-1.5 shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-secondary" aria-hidden="true" />
              <h1 className="truncate text-headline-sm text-on-surface">{studioName}</h1>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-fixed px-2.5 py-1 text-label-sm font-semibold text-on-secondary-fixed">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" aria-hidden="true" />
              Approved seller
            </span>
          </div>
          <p className="mt-1 text-caption text-on-surface-variant">
            Signed in as {user?.email}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-lowest px-4 py-2 text-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container-high"
          >
            Browse marketplace
            <Icon size="xs" className="text-on-surface-variant" aria-hidden="true">open_in_new</Icon>
          </Link>
          <Link
            href="/seller/products/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-container"
          >
            <Icon size="sm" aria-hidden="true">add</Icon>
            Add new product
          </Link>
        </div>
      </div>
    </div>
  );
}
