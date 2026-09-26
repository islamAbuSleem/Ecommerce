"use client";

import type { Product } from "@/services/products.service";
import { specRows } from "./product-specs";

export function SpecsAccordion({ product }: { product: Product }) {
  const rows = specRows(product);

  const sections: {
    id: string;
    title: string;
    icon: string;
    body: React.ReactNode;
  }[] = [
    {
      id: "story",
      title: "Technique & Story",
      icon: "auto_stories",
      body: product.description ? (
        <p className="text-body-sm text-on-surface-variant leading-relaxed">
          {product.description}
        </p>
      ) : (
        <p className="text-body-sm text-on-surface-variant leading-relaxed">
          No story has been added for this piece yet.
        </p>
      ),
    },
    {
      id: "specs",
      title: "Specifications",
      icon: "list_alt",
      body: (
        <dl className="divide-y divide-surface-container-high">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-label-sm text-on-surface-variant">{label}</dt>
              <dd className="text-body-sm text-on-surface text-right">{value}</dd>
            </div>
          ))}
        </dl>
      ),
    },
  ];

  return (
    <section aria-label="Product details" className="lg:hidden mt-4 space-y-3">
      {sections.map(({ id, title, icon, body }, i) => (
        <details
          key={id}
          open={i === 0}
          className="bg-surface-container-lowest rounded-xl shadow-sm px-4 open:pb-4"
        >
          <summary className="flex items-center gap-2 py-3.5 text-label-md text-on-surface cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">{icon}</span>
            <span className="flex-1">{title}</span>
            <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-outline">
              expand_more
            </span>
          </summary>
          {body}
        </details>
      ))}
    </section>
  );
}
