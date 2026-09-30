import type { RefObject } from "react";
import { Icon } from "@/components/ui/components/Icon";
import { MAX_REVIEW_NOTE_LENGTH, relativeTime } from "../../components/adminConfig";

export const REVIEW_NOTE_ERROR_ID = "review-note-error";
export const REVIEW_NOTE_HINT_ID = "review-note-hint";

type Props = {
  value: string;
  error?: string;
  reviewedByName: string | null;
  reviewedAt: string | null;
  disabled: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
};

export function ReviewNotesField({
  value,
  error,
  reviewedByName,
  reviewedAt,
  disabled,
  inputRef,
  onChange,
}: Props) {
  return (
    <section
      className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:p-6"
      aria-labelledby="review-notes-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2
          id="review-notes-heading"
          className="flex items-center gap-2 text-headline-sm text-on-surface"
        >
          <Icon size="md" className="text-primary" aria-hidden="true">lock</Icon>
          Review note
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-2.5 py-1 text-label-sm font-semibold text-on-surface-variant">
          <Icon size="xs" aria-hidden="true">shield</Icon>
          Internal only
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="review-note" className="text-label-md text-on-surface">
            Note for the review record
          </label>
          <span className="text-caption text-outline">
            {value.length} / {MAX_REVIEW_NOTE_LENGTH}
          </span>
        </div>
        <textarea
          id="review-note"
          rows={4}
          ref={inputRef}
          value={value}
          maxLength={MAX_REVIEW_NOTE_LENGTH}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder="What you checked, why you reached this decision, anything the next admin needs."
          aria-invalid={Boolean(error)}
          aria-describedby={error ? REVIEW_NOTE_ERROR_ID : REVIEW_NOTE_HINT_ID}
          className="w-full resize-y rounded-lg bg-surface-container-low p-3.5 text-body-md leading-relaxed text-on-surface placeholder:text-outline-variant focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed"
        />
        {error ? (
          <span id={REVIEW_NOTE_ERROR_ID} role="alert" className="text-caption text-error">
            {error}
          </span>
        ) : (
          <span id={REVIEW_NOTE_HINT_ID} className="text-caption text-outline">
            Saved onto the application when you record a decision. Declining needs a reason.
          </span>
        )}
      </div>

      <p className="flex items-center gap-2 rounded-lg bg-surface-container-low/40 p-3 text-caption text-on-surface-variant">
        <Icon size="sm" className="shrink-0 text-primary" aria-hidden="true">history</Icon>
        {reviewedAt
          ? `Last reviewed by ${reviewedByName ?? "an admin"} ${relativeTime(reviewedAt)}.`
          : "No reviewer has touched this application yet."}
      </p>
    </section>
  );
}
