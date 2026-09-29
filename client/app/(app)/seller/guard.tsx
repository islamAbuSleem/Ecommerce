"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { SellerGuardSkeleton } from "./components/SellerGuardSkeleton";
import { SellerOnlyState } from "./components/SellerOnlyState";
import { SellerPendingState } from "./components/SellerPendingState";

export function SellerGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const signedOut = !loading && !user;

  useEffect(() => {
    if (signedOut) router.replace("/login");
  }, [signedOut, router]);

  if (loading || !user) return <SellerGuardSkeleton />;
  if (user.role !== "seller") return <SellerOnlyState />;
  if (user.sellerStatus !== "approved") return <SellerPendingState status={user.sellerStatus} />;

  return <>{children}</>;
}
