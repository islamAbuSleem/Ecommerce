"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/components/Icon";
import { SellerGuard } from "../../guard";
import { ProductForm } from "../components/ProductForm";

export default function NewProductPage() {
  return (
    <SellerGuard>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-16">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 overflow-x-auto py-4 text-caption text-on-surface-variant"
        >
          <Link href="/seller/dashboard" className="whitespace-nowrap transition-colors hover:text-primary">
            Seller Studio
          </Link>
          <Icon size="xs" className="text-outline-variant" aria-hidden="true">chevron_right</Icon>
          <span className="whitespace-nowrap font-semibold text-on-surface">New product</span>
        </nav>

        <div className="flex flex-col gap-1 pb-4">
          <h1 className="text-headline-lg text-on-surface tracking-tight">List a new piece</h1>
          <p className="text-body-md text-on-surface-variant">
            Everything below becomes the public listing. Images are hosted URLs for now.
          </p>
        </div>

        <ProductForm mode="create" />
      </div>
    </SellerGuard>
  );
}
