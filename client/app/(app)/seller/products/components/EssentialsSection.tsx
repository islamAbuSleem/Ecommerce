"use client";

import { Icon } from "@/components/ui/components/Icon";
import { FormSection } from "./FormSection";
import { MAX_NAME_LENGTH, PRODUCT_CATEGORIES } from "./productFormConfig";

type Props = {
  name: string;
  category: string;
  description: string;
  errors: { name?: string; category?: string; description?: string };
  disabled: boolean;
  onName: (value: string) => void;
  onCategory: (value: string) => void;
  onDescription: (value: string) => void;
};

export const ESSENTIALS_ERROR_IDS = {
  name: "product-name-error",
  category: "product-category-error",
  description: "product-description-error",
} as const;

export function EssentialsSection({
  name,
  category,
  description,
  errors,
  disabled,
  onName,
  onCategory,
  onDescription,
}: Props) {
  const active = PRODUCT_CATEGORIES.find((entry) => entry.id === category);

  return (
    <FormSection
      id="section-essentials"
      icon="auto_stories"
      title="Listing essentials"
      description="What collectors see first on your listing."
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="product-name" className="text-label-md text-on-surface">
            Product title
          </label>
          <span className="text-caption text-outline">
            {name.length} / {MAX_NAME_LENGTH}
          </span>
        </div>
        <input
          id="product-name"
          type="text"
          value={name}
          maxLength={MAX_NAME_LENGTH}
          onChange={(e) => onName(e.target.value)}
          disabled={disabled}
          placeholder="Hand-thrown stoneware pour-over set"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? ESSENTIALS_ERROR_IDS.name : undefined}
          className="h-11 w-full rounded-lg bg-surface-container-low px-3.5 text-body-md text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed"
        />
        {errors.name && (
          <span id={ESSENTIALS_ERROR_IDS.name} role="alert" className="text-caption text-error">
            {errors.name}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="product-category" className="text-label-md text-on-surface">
          Marketplace category
        </label>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-low p-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
              <Icon size="sm" aria-hidden="true">{active?.icon ?? "category"}</Icon>
            </span>
            <div className="min-w-0">
              <p className="text-caption text-on-surface-variant">Selected directory</p>
              <p className="truncate text-body-md text-on-surface">
                {active ? active.label : "Nothing selected yet"}
              </p>
            </div>
          </div>
        </div>
        <select
          id="product-category"
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          disabled={disabled}
          aria-invalid={Boolean(errors.category)}
          aria-describedby={errors.category ? ESSENTIALS_ERROR_IDS.category : undefined}
          className="h-11 w-full rounded-lg bg-surface-container-low px-3.5 text-body-md text-on-surface focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed"
        >
          <option value="">Choose a category</option>
          {PRODUCT_CATEGORIES.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <span id={ESSENTIALS_ERROR_IDS.category} role="alert" className="text-caption text-error">
            {errors.category}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="product-description" className="text-label-md text-on-surface">
            Artisan story &amp; process
          </label>
          <span className="text-caption text-outline">Plain text</span>
        </div>
        <textarea
          id="product-description"
          rows={5}
          value={description}
          onChange={(e) => onDescription(e.target.value)}
          disabled={disabled}
          placeholder="Where the clay came from, how it was fired, what makes this piece yours."
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? ESSENTIALS_ERROR_IDS.description : undefined}
          className="w-full resize-y rounded-lg bg-surface-container-low p-3.5 text-body-md leading-relaxed text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed"
        />
        {errors.description && (
          <span
            id={ESSENTIALS_ERROR_IDS.description}
            role="alert"
            className="text-caption text-error"
          >
            {errors.description}
          </span>
        )}
      </div>
    </FormSection>
  );
}
