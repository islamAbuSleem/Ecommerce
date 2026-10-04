"use client";

import { ProfileGuard } from "./guard";
import { useAuth } from "@/components/auth/AuthContext";
import { Icon } from "@/components/ui/components/Icon";

export default function ProfilePage() {
  return (
    <ProfileGuard>
      <ProfileInner />
    </ProfileGuard>
  );
}

function ProfileInner() {
  const { user } = useAuth();

  if (!user) return null;

  const roleLabel =
    user.role === "admin"
      ? "Admin"
      : user.role === "seller"
        ? user.sellerStatus === "approved"
          ? "Verified seller"
          : "Seller (pending approval)"
        : "Buyer";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6">
      <div className="flex flex-col gap-4 pt-4 lg:pt-6">
        <h1 className="text-headline-md text-on-surface">Profile</h1>
        <div className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon size="lg">person</Icon>
            </span>
            <div>
              <p className="text-headline-sm text-on-surface">{user.fullName || "No name set"}</p>
              <p className="text-body-sm text-on-surface-variant">{user.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-surface-container/60 p-4">
              <p className="text-caption text-on-surface-variant">Role</p>
              <p className="text-label-md text-on-surface">{roleLabel}</p>
            </div>
            <div className="rounded-lg bg-surface-container/60 p-4">
              <p className="text-caption text-on-surface-variant">Account ID</p>
              <p className="text-label-md text-on-surface font-mono">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
