"use client";

import Link from "next/link";
import { use } from "react";
import { Icon } from "@/components/ui/components/Icon";
import { AdminGuard } from "../../guard";
import { ApplicantReviewView } from "./components/ApplicantReviewView";

export default function AdminVendorReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AdminGuard>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between gap-3 py-4">
          <Link
            href="/admin/vendors"
            className="inline-flex items-center gap-1.5 text-label-sm text-on-surface-variant transition-colors hover:text-primary"
          >
            <Icon size="xs" aria-hidden="true">arrow_back</Icon>
            All applications
          </Link>
        </div>
        <ApplicantReviewView key={id} id={id} />
      </div>
    </AdminGuard>
  );
}
