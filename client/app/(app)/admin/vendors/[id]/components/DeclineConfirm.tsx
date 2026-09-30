import { Icon } from "@/components/ui/components/Icon";

type Props = {
  applicantName: string;
  submitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeclineConfirm({ applicantName, submitting, onConfirm, onCancel }: Props) {
  // Escape backs out. Focus starts on the safe action, never the destructive
  // one, so a reflexive Enter cannot commit the decline.
  return (
    <div
      role="group"
      aria-labelledby="decline-confirm-heading"
      onKeyDown={(event) => {
        if (event.key === "Escape" && !submitting) {
          event.stopPropagation();
          onCancel();
        }
      }}
      className="flex flex-col gap-3 rounded-xl border border-error-container bg-error-container/30 p-4 shadow-sm"
    >
      <div className="flex items-start gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-error-container text-on-error-container">
          <Icon size="md" aria-hidden="true">warning</Icon>
        </span>
        <div className="min-w-0">
          <h2 id="decline-confirm-heading" className="text-label-md text-on-error-container">
            Decline this application?
          </h2>
          <p className="mt-0.5 text-caption text-on-error-container">
            {applicantName} keeps the seller role but stays locked out of the seller dashboard.
            Their existing listings are <strong>not</strong> removed from the marketplace — review
            them in the catalogue panel below if you want them taken down. You can change this
            decision later from this screen.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row-reverse">
        <button
          type="button"
          disabled={submitting}
          onClick={onConfirm}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-error px-4 py-2 text-label-md text-on-primary transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon size="sm" aria-hidden="true">block</Icon>
          {submitting ? "Declining…" : "Yes, decline"}
        </button>
        <button
          type="button"
          autoFocus
          disabled={submitting}
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface-container-lowest px-4 py-2 text-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed"
        >
          Keep reviewing
        </button>
      </div>
    </div>
  );
}
