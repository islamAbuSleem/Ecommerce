import { Icon } from "@/components/ui/components/Icon";
import type { AdminDecision } from "@/services/admin.service";
import { DeclineConfirm } from "./DeclineConfirm";

type Props = {
  applicantName: string;
  deciding: AdminDecision | null;
  confirmingDecline: boolean;
  infoRequested: boolean;
  onApprove: () => void;
  onRequestInfo: () => void;
  onAskDecline: () => void;
  onCancelDecline: () => void;
  onConfirmDecline: () => void;
};

export function ReviewActions({
  applicantName,
  deciding,
  confirmingDecline,
  infoRequested,
  onApprove,
  onRequestInfo,
  onAskDecline,
  onCancelDecline,
  onConfirmDecline,
}: Props) {
  const busy = deciding !== null;

  if (confirmingDecline) {
    return (
      <section
        className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:p-6"
        aria-label="Application resolution"
      >
        <DeclineConfirm
          applicantName={applicantName}
          submitting={deciding === "decline"}
          onConfirm={onConfirmDecline}
          onCancel={onCancelDecline}
        />
      </section>
    );
  }

  return (
    <section
      className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm lg:p-6"
      aria-label="Application resolution"
    >
      <h2 className="text-label-md text-on-surface">Application resolution</h2>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={onApprove}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon size="md" aria-hidden="true">assignment_turned_in</Icon>
          {deciding === "approve" ? "Approving…" : "Approve application"}
        </button>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            disabled={busy}
            onClick={onRequestInfo}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-2.5 text-label-sm text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon size="sm" aria-hidden="true">edit_document</Icon>
            Note what you need
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onAskDecline}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-error-container px-3 py-2.5 text-label-sm text-on-error-container transition-colors hover:bg-error-container/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon size="sm" aria-hidden="true">block</Icon>
            Decline
          </button>
        </div>
      </div>

      {infoRequested && (
        <p className="flex items-start gap-2 rounded-lg bg-surface-container-low/60 p-3 text-caption text-on-surface-variant">
          <Icon size="sm" className="mt-0.5 shrink-0 text-primary" aria-hidden="true">forward_to_inbox</Icon>
          Aura has no email pipeline, so nothing was sent to the applicant. Write what you need in
          the review note — it is stored on the application when you record a decision.
        </p>
      )}

      <p className="text-caption text-outline">
        Approving sets the account to seller and opens the seller dashboard. No onboarding email,
        payout account or store subdomain is created.
      </p>
    </section>
  );
}
