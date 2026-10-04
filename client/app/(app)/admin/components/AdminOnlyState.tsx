import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { Icon } from "@/components/ui/components/Icon";
import {
  ADMIN_SCOPE_COPY,
  NEUTRAL_ADMIN_SCOPE_COPY,
  type AdminScopeCopy,
} from "../vendors/components/adminConfig";

export function AdminOnlyState() {
  const { user } = useAuth();
  const copy: AdminScopeCopy =
    (user?.role ? ADMIN_SCOPE_COPY[user.role] : undefined) ?? NEUTRAL_ADMIN_SCOPE_COPY;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-16">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
          <Icon size="lg" aria-hidden="true">shield_person</Icon>
        </span>
        <h1 className="text-headline-md text-on-surface">{copy.title}</h1>
        <p className="max-w-md text-body-md text-on-surface-variant">{copy.body}</p>
        <Link
          href={user?.role === "seller" ? "/seller/dashboard" : "/products"}
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-container"
        >
          <Icon size="sm" aria-hidden="true">storefront</Icon>
          {user?.role === "seller" ? "Back to your studio" : "Back to the marketplace"}
        </Link>
      </div>
    </div>
  );
}
