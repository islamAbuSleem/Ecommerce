"use client";

import { useRef, useState } from "react";
import type { Product } from "@/services/products.service";
import { specRows } from "./product-specs";

type TabId = "story" | "specs";

const TABS: { id: TabId; label: string }[] = [
  { id: "story", label: "Technique & Story" },
  { id: "specs", label: "Specifications" },
];

export function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<TabId>("story");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rows = specRows(product);

  const focusTab = (index: number) => {
    const id = TABS[index]?.id;
    if (!id) return;
    setActive(id);
    tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    if (next != null) {
      e.preventDefault();
      focusTab(next);
    }
  };

  return (
    <section aria-label="Product details" className="hidden lg:block">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex items-center gap-1 bg-surface-container-lowest rounded-xl shadow-sm p-1.5"
      >
        {TABS.map(({ id, label }, index) => {
          const selected = active === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`product-tab-${id}`}
              aria-selected={selected}
              aria-controls={`product-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              onKeyDown={(e) => handleTabKeyDown(e, index)}
              onClick={() => setActive(id)}
              className={`px-4 py-2 rounded-lg text-label-md transition-colors ${
                selected
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 bg-surface-container-lowest rounded-xl shadow-sm p-6">
        {active === "story" ? (
          <div
            role="tabpanel"
            id="product-panel-story"
            aria-labelledby="product-tab-story"
            className="space-y-2"
          >
            <h2 className="text-headline-sm text-on-surface">Technique &amp; Story</h2>
            {product.description ? (
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            ) : (
              <p className="text-body-md text-on-surface-variant leading-relaxed">
                No story has been added for this piece yet.
              </p>
            )}
          </div>
        ) : (
          <div
            role="tabpanel"
            id="product-panel-specs"
            aria-labelledby="product-tab-specs"
            className="space-y-2"
          >
            <h2 className="text-headline-sm text-on-surface">Specifications</h2>
            <dl className="divide-y divide-surface-container-high">
              {rows.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-label-sm text-on-surface-variant">{label}</dt>
                  <dd className="text-body-sm text-on-surface text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
