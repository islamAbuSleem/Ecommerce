"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/components/Icon";
import { FormSection } from "./FormSection";
import { MAX_IMAGES } from "./productFormConfig";

type Props = {
  images: string[];
  draftUrl: string;
  draftError?: string;
  listError?: string;
  disabled: boolean;
  onDraftChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export const MEDIA_ERROR_IDS = {
  draft: "image-url-error",
  list: "image-list-error",
} as const;

export function MediaGallerySection({
  images,
  draftUrl,
  draftError,
  listError,
  disabled,
  onDraftChange,
  onAdd,
  onRemove,
}: Props) {
  const cover = images[0];
  const thumbs = images.slice(1);
  const full = images.length >= MAX_IMAGES;

  return (
    <FormSection
      id="section-media"
      icon="photo_library"
      title="Studio media"
      description="Paste hosted image URLs. Uploading straight to Aura storage is not wired up yet."
      aside={
        <span className="rounded-full bg-surface-container px-2.5 py-1 text-label-sm font-semibold text-primary">
          {images.length} / {MAX_IMAGES}
        </span>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface-container shadow-sm sm:col-span-2 sm:aspect-square">
          {cover ? (
            <>
              <Image
                src={cover}
                alt="Cover image"
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 44vw"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-label-sm font-semibold text-on-primary shadow-sm">
                <Icon size="xs" filled aria-hidden="true">star</Icon>
                Cover image
              </span>
              <button
                type="button"
                onClick={() => onRemove(0)}
                disabled={disabled}
                aria-label="Remove cover image"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/90 text-error shadow-sm backdrop-blur-md transition-transform active:scale-95 disabled:cursor-not-allowed"
              >
                <Icon size="sm" aria-hidden="true">delete</Icon>
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-caption text-outline">
              <Icon size="lg" aria-hidden="true">image</Icon>
              No cover image yet
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {thumbs.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative aspect-video overflow-hidden rounded-xl bg-surface-container shadow-sm sm:aspect-square"
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, 18vw"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(index + 1)}
                disabled={disabled}
                aria-label={`Remove image ${index + 2}`}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-inverse-surface/75 text-inverse-on-surface disabled:cursor-not-allowed"
              >
                <Icon size="xs" aria-hidden="true">close</Icon>
              </button>
            </div>
          ))}

          <div
            aria-disabled="true"
            title="Uploading photos is coming soon — paste an image URL instead"
            className="flex cursor-not-allowed flex-col items-center justify-center gap-1 rounded-xl bg-surface-container-low p-4 text-center"
          >
            <Icon size="lg" className="text-outline" aria-hidden="true">add_a_photo</Icon>
            <span className="text-label-sm font-semibold text-outline">Upload photos</span>
            <span className="text-caption text-outline">Coming soon</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor="image-url" className="text-label-sm text-on-surface">
              Image URL
            </label>
            <input
              id="image-url"
              type="url"
              inputMode="url"
              value={draftUrl}
              onChange={(e) => onDraftChange(e.target.value)}
              disabled={disabled || full}
              placeholder="https://example.com/photo.jpg"
              aria-invalid={Boolean(draftError)}
              aria-describedby={draftError ? MEDIA_ERROR_IDS.draft : undefined}
              className="mt-1 h-11 w-full rounded-lg bg-surface-container-low px-3.5 text-body-md text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="button"
            onClick={onAdd}
            disabled={disabled || full}
            className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-primary px-4 text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon size="sm" aria-hidden="true">add</Icon>
            Add
          </button>
        </div>
        {draftError && (
          <p id={MEDIA_ERROR_IDS.draft} role="alert" className="text-caption text-error">
            {draftError}
          </p>
        )}
        {listError && (
          <p id={MEDIA_ERROR_IDS.list} role="alert" className="text-caption text-error">
            {listError}
          </p>
        )}
        {full && (
          <p className="text-caption text-outline">
            {MAX_IMAGES} images is the maximum. Remove one before adding another.
          </p>
        )}
      </div>
    </FormSection>
  );
}
