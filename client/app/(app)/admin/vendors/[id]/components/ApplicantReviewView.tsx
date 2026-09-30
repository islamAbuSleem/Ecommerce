"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/components/Icon";
import { ApiError } from "@/services/api";
import {
  adminService,
  type AdminDecision,
  type SellerApplicationDetail,
} from "@/services/admin.service";
import {
  MAX_REVIEW_NOTE_LENGTH,
  applicantName,
  decisionError,
  loadError,
  type ReviewOutcome,
} from "../../components/adminConfig";
import { ApplicantIdentityCard } from "./ApplicantIdentityCard";
import { ApplicantProductsPanel } from "./ApplicantProductsPanel";
import { ApplicantReviewHeader } from "./ApplicantReviewHeader";
import { NotConfiguredPanel } from "./NotConfiguredPanel";
import { ReviewActions } from "./ReviewActions";
import { ReviewNotesField } from "./ReviewNotesField";
import { ReviewOutcomeBanner } from "./ReviewOutcomeBanner";

const NOTE_REQUIRED = "Add a reason so the decision is recorded for the next reviewer.";
const NOTE_TOO_LONG = `Keep the note under ${MAX_REVIEW_NOTE_LENGTH} characters.`;

type Props = {
  id: string;
};

export function ApplicantReviewView({ id }: Props) {
  const [application, setApplication] = useState<SellerApplicationDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState<string | undefined>();
  const [deciding, setDeciding] = useState<AdminDecision | null>(null);
  const [decisionFailure, setDecisionFailure] = useState<string | null>(null);
  const [confirmingDecline, setConfirmingDecline] = useState(false);
  const [infoRequested, setInfoRequested] = useState(false);
  const [outcome, setOutcome] = useState<ReviewOutcome | null>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;

    adminService
      .sellerApplication(id)
      .then((next) => {
        if (cancelled) return;
        setApplication(next);
        setNote(next.reviewNote ?? "");
        setNoteError(undefined);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.error("[admin/vendor-review]", err);
        setApplication(null);
        if (err instanceof ApiError && err.status === 404) setNotFound(true);
        else setError(loadError(err instanceof ApiError ? err.status : undefined));
      });

    return () => {
      cancelled = true;
    };
  }, [id, retryKey]);

  const focusNote = (message: string) => {
    setNoteError(message);
    noteRef.current?.focus();
  };

  const requestInfo = () => {
    setInfoRequested(true);
    noteRef.current?.focus();
  };

  const decide = async (decision: AdminDecision) => {
    const trimmed = note.trim();
    if (decision === "decline" && trimmed.length === 0) {
      focusNote(NOTE_REQUIRED);
      setConfirmingDecline(false);
      return;
    }
    // Defence in depth: the textarea's maxLength already prevents this, but if
    // that attribute is ever removed the server would reject the note with a
    // 400 the user cannot act on. Keep the check.
    if (note.length > MAX_REVIEW_NOTE_LENGTH) {
      focusNote(NOTE_TOO_LONG);
      setConfirmingDecline(false);
      return;
    }

    setDeciding(decision);
    setDecisionFailure(null);

    try {
      const result = await adminService.decideSellerApplication(id, {
        decision,
        ...(trimmed.length > 0 ? { note: trimmed } : {}),
      });
      setOutcome({ decision, decidedAt: result.reviewedAt });
      setConfirmingDecline(false);
      setInfoRequested(false);
      setNoteError(undefined);
      setNote(result.reviewNote ?? "");
      // Merge the decision response first so the pill can never read "Pending" again,
      // then pull the authoritative record for products and reviewer fields.
      setApplication((current) =>
        current
          ? {
              ...current,
              id: result.id,
              role: result.role,
              sellerStatus: result.sellerStatus,
              reviewedAt: result.reviewedAt,
              reviewNote: result.reviewNote,
            }
          : current,
      );
      try {
        const refreshed = await adminService.sellerApplication(id);
        setApplication(refreshed);
        setNote(refreshed.reviewNote ?? "");
      } catch (refreshErr: unknown) {
        console.error("[admin/vendor-review/refresh]", refreshErr);
      }
    } catch (err: unknown) {
      console.error("[admin/vendor-review/decision]", err);
      setDecisionFailure(decisionError(err instanceof ApiError ? err.status : undefined));
    } finally {
      setDeciding(null);
    }
  };

  if (notFound) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
        <Icon size="xl" className="text-outline" aria-hidden="true">search_off</Icon>
        <h2 className="text-headline-md text-on-surface">Application not found</h2>
        <p className="max-w-sm text-body-sm text-on-surface-variant">
          This seller application is no longer in the queue, or the link is wrong.
        </p>
        <Link
          href="/admin/vendors"
          className="mt-1 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
        >
          <Icon size="sm" aria-hidden="true">arrow_back</Icon>
          Back to the queue
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
        <Icon size="xl" className="text-outline" aria-hidden="true">error</Icon>
        <h2 className="text-headline-md text-on-surface">Application unavailable</h2>
        <p className="max-w-sm text-body-sm text-on-surface-variant">{error}</p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setRetryKey((key) => key + 1);
          }}
          className="mt-1 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary transition-colors hover:bg-primary-container"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col gap-4" aria-label="Loading application" aria-busy="true">
        <div className="h-32 rounded-xl bg-surface-container-lowest animate-pulse" />
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <div className="h-56 rounded-xl bg-surface-container-lowest animate-pulse" />
            <div className="h-72 rounded-xl bg-surface-container-lowest animate-pulse" />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5">
            <div className="h-40 rounded-xl bg-surface-container-lowest animate-pulse" />
            <div className="h-48 rounded-xl bg-surface-container-lowest animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const name = applicantName(application);

  return (
    <div className="flex flex-col gap-4 pb-6 lg:gap-6">
      <ApplicantReviewHeader application={application} />

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-6">
          <ApplicantIdentityCard application={application} />
          <ApplicantProductsPanel application={application} />
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-6">
          <NotConfiguredPanel />
          <div role="status" aria-live="polite">
            {outcome ? <ReviewOutcomeBanner outcome={outcome} /> : null}
          </div>
          {decisionFailure && (
            <p role="alert" className="rounded-lg bg-error-container px-3.5 py-2.5 text-body-sm text-on-error-container">
              {decisionFailure}
            </p>
          )}
          <ReviewNotesField
            value={note}
            error={noteError}
            reviewedByName={application.reviewedByName}
            reviewedAt={application.reviewedAt}
            disabled={deciding !== null}
            inputRef={noteRef}
            onChange={(value) => {
              setNote(value);
              if (noteError) setNoteError(undefined);
            }}
          />
          <ReviewActions
            applicantName={name}
            deciding={deciding}
            confirmingDecline={confirmingDecline}
            infoRequested={infoRequested}
            onApprove={() => void decide("approve")}
            onRequestInfo={requestInfo}
            onAskDecline={() => {
              setInfoRequested(false);
              setConfirmingDecline(true);
            }}
            onCancelDecline={() => setConfirmingDecline(false)}
            onConfirmDecline={() => void decide("decline")}
          />
        </div>
      </div>
    </div>
  );
}
