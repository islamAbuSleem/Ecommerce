"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { AdminGuardSkeleton } from "./components/AdminGuardSkeleton";
import { AdminOnlyState } from "./components/AdminOnlyState";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const signedOut = !loading && !user;

  useEffect(() => {
    if (signedOut) router.replace("/login");
  }, [signedOut, router]);

  // Nothing behind the gate renders until the role is known, so protected content
  // can never flash for a signed-out or non-admin visitor.
  if (loading || !user) return <AdminGuardSkeleton />;
  if (user.role !== "admin") return <AdminOnlyState />;

  return <>{children}</>;
}
