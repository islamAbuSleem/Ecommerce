"use client";

import { Icon } from "@/components/ui/components/Icon";
import { FormSection } from "./FormSection";
import { PRODUCT_STATUS_OPTIONS } from "./productFormConfig";

type Props = {
  price: string;
  stock: string;
  freeShipping: boolean;
  status: string;
  errors: { price?: string; stock?: string; status?: string };
  disabled: boolean;
  onPrice: (value: string) => void;
  onStock: (value: string) => void;
  onFreeShipping: (value: boolean) => void;
  onStatus: (value: string) => void;
};

export const PRICING_ERROR_IDS = {
  price: "product-price-error",
  stock: "product-stock-error",
  status: "product-status-error",
} as const;

export function PricingStockSection({
  price,
  stock,
  freeShipping,
  status,
  errors,
  disabled,
  onPrice,
  onStock,
  onFreeShipping,
  onStatus,
}: Props) {
  return (
    <FormSection
      id="section-pricing"
      icon="payments"
      title="Pricing &amp; stock"
      description="What the listing costs and how many units you have on hand."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="product-price" className="text-label-sm text-on-surface">
            Listing price (USD)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-label-md text-outline">$</span>
            <input
              id="product-price"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(e) => onPrice(e.target.value)}
              disabled={disabled}
              placeholder="0.00"
              aria-invalid={Boolean(errors.price)}
              aria-describedby={errors.price ? PRICING_ERROR_IDS.price : undefined}
              className="h-11 w-full rounded-lg bg-surface-container-low pl-7 pr-3 text-headline-sm text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed"
            />
          </div>
          {errors.price && (
            <span id={PRICING_ERROR_IDS.price} role="alert" className="text-caption text-error">
              {errors.price}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="product-stock" className="text-label-sm text-on-surface">
            Units in stock
          </label>
          <div className="relative flex items-center">
            <input
              id="product-stock"
              type="number"
              inputMode="numeric"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => onStock(e.target.value)}
              disabled={disabled}
              placeholder="0"
              aria-invalid={Boolean(errors.stock)}
              aria-describedby={errors.stock ? PRICING_ERROR_IDS.stock : undefined}
              className="h-11 w-full rounded-lg bg-surface-container-low px-3 text-headline-sm text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed"
            />
            <span className="absolute right-3 text-caption text-outline">units</span>
          </div>
          {errors.stock && (
            <span id={PRICING_ERROR_IDS.stock} role="alert" className="text-caption text-error">
              {errors.stock}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-low p-3.5">
        <div className="flex items-center gap-2">
          <input
            id="product-free-shipping"
            type="checkbox"
            checked={freeShipping}
            onChange={(e) => onFreeShipping(e.target.checked)}
            disabled={disabled}
            className="h-4 w-4 accent-primary"
          />
          <label htmlFor="product-free-shipping" className="text-body-md text-on-surface">
            Free shipping
          </label>
        </div>
        <Icon size="sm" className="text-secondary" aria-hidden="true">local_shipping</Icon>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="product-status" className="text-label-sm text-on-surface">
          Listing status
        </label>
        <select
          id="product-status"
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(errors.status)}
          aria-describedby={errors.status ? PRICING_ERROR_IDS.status : undefined}
          className="h-11 w-full rounded-lg bg-surface-container-low px-3.5 text-body-md text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed"
        >
          {PRODUCT_STATUS_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.status && (
          <span id={PRICING_ERROR_IDS.status} role="alert" className="text-caption text-error">
            {errors.status}
          </span>
        )}
      </div>
    </FormSection>
  );
}
