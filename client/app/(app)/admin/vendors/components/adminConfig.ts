import type {
  AdminApplicationFilter,
  AdminDecision,
  AdminRole,
  AdminSellerStatus,
} from "@/services/admin.service";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

/**
 * Mirrors `SELLER_REVIEW_NOTE_MAX_LENGTH` in
 * `server/src/admin/dto/review-seller-application.dto.ts`. If you change one,
 * change the other or long notes 400 at the server.
 */
export const MAX_REVIEW_NOTE_LENGTH = 1000;

export const APPLICATION_FILTERS: { id: AdminApplicationFilter; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Not approved" },
  { id: "all", label: "All" },
];

function normaliseSellerStatus(status: string | null | undefined): string {
  return (status ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
}

type StatusPill = { label: string; icon: string; chip: string; dot?: string };

/** Only the three states the review API can return, plus a neutral chip for "never applied". */
const SELLER_STATUS_PILLS: Record<string, StatusPill> = {
  pending: {
    label: "Pending approval",
    icon: "hourglass_top",
    chip: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    dot: "bg-tertiary",
  },
  approved: {
    label: "Approved",
    icon: "check_circle",
    chip: "bg-success-lightest text-success-foreground",
  },
  rejected: {
    label: "Not approved",
    icon: "block",
    chip: "bg-error-container text-on-error-container",
  },
};

const NO_STATUS_PILL: StatusPill = {
  label: "No application",
  icon: "storefront",
  chip: "bg-surface-container text-on-surface-variant",
};

export function sellerStatusPill(status: AdminSellerStatus | null): StatusPill {
  const key = normaliseSellerStatus(status);
  return SELLER_STATUS_PILLS[key] ?? NO_STATUS_PILL;
}

const PRODUCT_STATUS_PILLS: Record<string, StatusPill> = {
  active: {
    label: "Active",
    icon: "visibility",
    chip: "bg-success-lightest text-success-foreground",
  },
  inactive: {
    label: "Hidden",
    icon: "visibility_off",
    chip: "bg-surface-container text-on-surface-variant",
  },
  deleted: {
    label: "Deleted",
    icon: "delete",
    chip: "bg-error-container/50 text-on-error-container",
  },
};

export function productStatusPill(status: string): StatusPill {
  return (
    PRODUCT_STATUS_PILLS[normaliseSellerStatus(status)] ?? {
      label: "Unknown",
      icon: "help",
      chip: "bg-surface-container text-on-surface-variant",
    }
  );
}

const ROLE_LABELS: Record<AdminRole, string> = {
  buyer: "Buyer account",
  seller: "Seller account",
  admin: "Admin account",
};

export function roleLabel(role: AdminRole): string {
  return ROLE_LABELS[role] ?? "Account";
}

const CATEGORY_ICONS: Record<string, string> = {
  ceramics: "coffee",
  "leather goods": "handbag",
  "desk tech": "devices",
  "studio wood": "forest",
  "fine jewelry": "diamond",
  "woven textile": "texture",
};

export function categoryIcon(category: string | null): string {
  if (!category) return "category";
  return CATEGORY_ICONS[category.trim().toLowerCase()] ?? "category";
}

export type AdminScopeCopy = {
  title: string;
  body: string;
};

/** Branched on the signed-in role so each account is told why it cannot see the console. */
export const ADMIN_SCOPE_COPY: Record<string, AdminScopeCopy> = {
  buyer: {
    title: "Admins only",
    body: "Your account is signed in as a buyer, so the admin console stays hidden. Seller applications are reviewed by the marketplace team.",
  },
  seller: {
    title: "Admins only",
    body: "Your account is signed in as a seller, so the admin console stays hidden. Your own application status is on your seller dashboard.",
  },
};

export const NEUTRAL_ADMIN_SCOPE_COPY: AdminScopeCopy = {
  title: "Admins only",
  body: "This account does not have marketplace admin access, so the console stays hidden. Ask an existing admin to review your role.",
};

/**
 * Design sections that would need a provider Aura has not integrated. Rendering them as
 * live checks would be fiction, so each one is listed here as plainly unavailable.
 */
export const UNAVAILABLE_SECTIONS: { icon: string; title: string; body: string }[] = [
  {
    icon: "verified_user",
    title: "Identity & compliance checks",
    body: "Tax-ID, business-registration, bank-account and product-certification lookups all need verification providers Aura has not integrated. No check has been run on this application.",
  },
  {
    icon: "percent",
    title: "Commercial terms & take-rate",
    body: "Aura has no commission engine yet, so there is no fee tier, take-rate, escrow window or listing quota to set. Sellers are not charged on a sale today.",
  },
  {
    icon: "folder_open",
    title: "Supporting documents & media",
    body: "There is no file storage behind a seller application, so lookbooks, certificates and workshop video cannot be uploaded, previewed or malware-scanned.",
  },
];

const LIST_ERROR_COPY: Record<number, string> = {
  400: "That status filter isn't one we recognise. Pick another filter.",
  401: "Your session expired. Sign in again to see the queue.",
  403: "Your account doesn't have admin access to this queue.",
};

const DECISION_ERROR_COPY: Record<number, string> = {
  400: "The decision wasn't accepted. Check the review note and try again.",
  401: "Your session expired. Sign in again to record the decision.",
  403: "Your account isn't allowed to record review decisions. Ask another admin to do it.",
  404: "That seller application no longer exists.",
};

const LOAD_ERROR_COPY: Record<number, string> = {
  401: "Your session expired. Sign in again to open the application.",
  403: "Your account doesn't have admin access to this application.",
  404: "That seller application no longer exists.",
};

function friendlyAdminError(
  copy: Record<number, string>,
  status: number | undefined,
): string {
  if (status !== undefined && copy[status]) return copy[status];
  return "Something went wrong on our side. Try again in a moment.";
}

export function listError(status: number | undefined): string {
  return friendlyAdminError(LIST_ERROR_COPY, status);
}

export function loadError(status: number | undefined): string {
  return friendlyAdminError(LOAD_ERROR_COPY, status);
}

export function decisionError(status: number | undefined): string {
  return friendlyAdminError(DECISION_ERROR_COPY, status);
}

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatCurrency(value: number): string {
  return currency.format(value);
}

export function formatCount(value: number, singular: string, plural: string): string {
  return `${value} ${value === 1 ? singular : plural}`;
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateTime(value: string | null): string {
  const parsed = parseDate(value);
  if (!parsed) return "—";
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** Short absolute date, used once a timestamp is old enough that "13d ago" stops helping. */
function formatShortDate(value: string | null): string {
  const parsed = parseDate(value);
  if (!parsed) return "—";
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Only called from client components — the value is never rendered during SSR. */
export function relativeTime(value: string | null, now: number = Date.now()): string {
  const parsed = parseDate(value);
  if (!parsed) return "—";
  const diff = now - parsed.getTime();
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)}d ago`;
  return formatShortDate(value);
}

export function applicantName(application: {
  fullName: string | null;
  email: string;
}): string {
  const trimmed = application.fullName?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : application.email;
}

export function applicantInitials(name: string): string {
  const cleaned = name.trim();
  if (cleaned.length === 0) return "?";
  const at = cleaned.indexOf("@");
  const base = at > 0 ? cleaned.slice(0, at) : cleaned;
  const parts = base.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

/** The API exposes raw uuids, so the reference is a readable prefix rather than a fake ID. */
export function applicationReference(id: string): string {
  return `#${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export type ReviewOutcome = { decision: AdminDecision; decidedAt: string | null };

export function reviewOutcomeCopy(decision: AdminDecision): {
  title: string;
  body: string;
  icon: string;
  tone: string;
} {
  if (decision === "approve") {
    return {
      title: "Approved and saved",
      icon: "check_circle",
      tone: "bg-success-lightest text-success-foreground",
      body: "The account is now a seller and its dashboard is open. No onboarding email was sent — Aura has no email pipeline yet.",
    };
  }
  return {
    title: "Declined and saved",
    icon: "block",
    tone: "bg-error-container text-on-error-container",
    body: "The account keeps the seller role but stays locked out of the seller dashboard. Their existing listings stay on the marketplace. No email was sent — Aura has no email pipeline yet.",
  };
}
