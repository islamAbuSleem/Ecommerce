"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { OrdersGuardSkeleton } from "./components/OrdersGuardSkeleton";

export function OrdersGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const signedOut = !loading && !user;

  useEffect(() => {
    if (signedOut) router.replace("/login");
  }, [signedOut, router]);

  if (loading || !user) return <OrdersGuardSkeleton />;

  return <>{children}</>;
}
