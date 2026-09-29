"use client";

import { Icon } from "@/components/ui/components/Icon";
import type { SellerRange } from "@/services/seller.service";
import { RANGE_OPTIONS } from "./dashboardConfig";

type Props = {
  value: SellerRange;
  onChange: (range: SellerRange) => void;
};

export function DateRangeControl({ value, onChange }: Props) {
  return (
    <div className="w-full sm:w-auto">
      <div className="flex items-center gap-2 rounded-lg bg-surface-container-lowest px-3.5 py-2 text-label-sm text-on-surface-variant shadow-sm">
        <Icon size="sm" className="text-primary" aria-hidden="true">calendar_today</Icon>
        <select
          aria-label="Reporting period"
          value={value}
          onChange={(e) => onChange(e.target.value as SellerRange)}
          className="cursor-pointer bg-transparent pr-1 text-label-md text-on-surface focus:outline-none"
        >
          {RANGE_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon size="xs" className="text-on-surface-variant" aria-hidden="true">expand_more</Icon>
      </div>
      <p className="mt-1 text-caption text-outline">
        Applies to the sales and order figures. Stock levels are always live.
      </p>
    </div>
  );
}
