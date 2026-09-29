import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { Icon } from "@/components/ui/components/Icon";

const COPY: Record<string, { title: string; body: string }> = {
  admin: {
    title: "This area is for sellers",
    body: "Your account is signed in as a marketplace admin, so the seller studio is hidden. Use the admin console to manage sellers and listings.",
  },
  buyer: {
    title: "This area is for sellers",
    body: "Your account is signed in as a buyer, so the seller studio stays hidden. Register as a seller to list your work and manage orders.",
  },
};

const FALLBACK = {
  title: "This area is for sellers",
  body: "Your account does not have seller access, so the seller studio stays hidden. Register as a seller to list your work and manage orders.",
};

export function SellerOnlyState() {
  const { user } = useAuth();
  const copy = (user?.role && COPY[user.role]) || FALLBACK;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-16">
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-lowest p-10 text-center shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
          <Icon size="lg" aria-hidden="true">storefront</Icon>
        </span>
        <h1 className="text-headline-md text-on-surface">{copy.title}</h1>
        <p className="max-w-md text-body-md text-on-surface-variant">{copy.body}</p>
        <Link
          href="/register"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-container"
        >
          <Icon size="sm" aria-hidden="true">add_business</Icon>
          Register as a seller
        </Link>
        <Link
          href="/products"
          className="text-label-sm text-primary underline underline-offset-2 transition-colors hover:text-on-primary-fixed-variant"
        >
          Back to the marketplace
        </Link>
      </div>
    </div>
  );
}
