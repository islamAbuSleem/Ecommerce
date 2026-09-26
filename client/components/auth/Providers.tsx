"use client";

import { AuthProvider } from "./AuthContext";
import { CartProvider } from "@/components/cart/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
