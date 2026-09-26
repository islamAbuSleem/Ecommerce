"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { cartService, type GuestCartItem } from "@/services/cart.service";
import { productsService, type Product } from "@/services/products.service";

export type CartItem = {
  id?: string;
  product: Product;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  loading: boolean;
  add: (productId: string, qty?: number) => Promise<void>;
  updateQty: (productId: string, qty: number) => Promise<boolean>;
  remove: (productId: string) => Promise<boolean>;
  clear: () => Promise<boolean>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextValue>({
  items: [],
  count: 0,
  total: 0,
  loading: true,
  add: async () => {},
  updateQty: async () => false,
  remove: async () => false,
  clear: async () => false,
  refresh: async () => {},
});

const CART_COOKIE = "cart";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const prefix = `${name}=`;
  const parts = document.cookie.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      try {
        return decodeURIComponent(trimmed.slice(prefix.length));
      } catch {
        return null;
      }
    }
  }
  return null;
}

function setCookie(name: string, value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}`;
}

function eraseCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

function isGuestCartItem(entry: unknown): entry is GuestCartItem {
  if (!entry || typeof entry !== "object") return false;
  const record = entry as { productId?: unknown; qty?: unknown };
  return (
    typeof record.productId === "string" &&
    record.productId.length > 0 &&
    typeof record.qty === "number" &&
    Number.isInteger(record.qty) &&
    record.qty > 0
  );
}

function readGuestItems(): GuestCartItem[] {
  try {
    const raw = getCookie(CART_COOKIE);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as { items?: unknown }).items)) {
      return (parsed as { items: unknown[] }).items.filter(isGuestCartItem);
    }
    return [];
  } catch {
    return [];
  }
}

function writeGuestItems(items: GuestCartItem[]): void {
  try {
    setCookie(CART_COOKIE, JSON.stringify({ items }));
  } catch {
    // Cookie storage unavailable — local state still updates below.
  }
}

async function resolveGuestItems(entries: GuestCartItem[]): Promise<CartItem[]> {
  const settled = await Promise.allSettled(entries.map((entry) => productsService.getById(entry.productId)));
  const resolved: CartItem[] = [];
  const notFoundIds = new Set<string>();
  settled.forEach((result, index) => {
    if (result.status === "fulfilled" && result.value) {
      resolved.push({ product: result.value, qty: entries[index].qty });
    } else if (result.status === "rejected") {
      const status = (result.reason as { status?: number } | null)?.status;
      if (status === 404) notFoundIds.add(entries[index].productId);
    }
  });
  if (notFoundIds.size > 0) {
    writeGuestItems(entries.filter((entry) => !notFoundIds.has(entry.productId)));
  }
  return resolved;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const userId = user?.id ?? null;
  const prevUserId = useRef<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    if (userId) {
      try {
        const cart = await cartService.get();
        setItems(cart.items);
        setServerTotal(typeof cart.total === "number" ? cart.total : null);
      } catch (err) {
        console.error("[cart refresh]", err);
        setItems([]);
        setServerTotal(null);
      }
      return;
    }
    setServerTotal(null);
    const entries = readGuestItems();
    if (entries.length === 0) {
      setItems([]);
      return;
    }
    try {
      setItems(await resolveGuestItems(entries));
    } catch (err) {
      console.error("[cart refresh]", err);
      setItems([]);
    }
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      if (userId !== null && prevUserId.current !== userId) {
        const guest = readGuestItems();
        if (guest.length > 0) {
          try {
            await cartService.merge(guest);
            eraseCookie(CART_COOKIE);
          } catch (err) {
            console.error("[cart merge]", err);
          }
        }
      }
      prevUserId.current = userId;
      await refresh();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, refresh]);

  const add = useCallback(
    async (productId: string, qty = 1): Promise<void> => {
      const safeQty = Math.max(1, Math.floor(qty));
      if (userId) {
        try {
          await cartService.add(productId, safeQty);
          await refresh();
        } catch (err) {
          console.error("[cart add]", err);
        }
        return;
      }
      const entries = readGuestItems();
      const existing = entries.find((entry) => entry.productId === productId);
      if (existing) {
        existing.qty += safeQty;
      } else {
        entries.push({ productId, qty: safeQty });
      }
      writeGuestItems(entries);
      try {
        setItems(await resolveGuestItems(entries));
      } catch (err) {
        console.error("[cart add]", err);
      }
    },
    [userId, refresh],
  );

  const updateQty = useCallback(
    async (productId: string, qty: number): Promise<boolean> => {
      const safeQty = Math.floor(qty);
      if (userId) {
        try {
          let key = items.find((line) => line.product.id === productId)?.id;
          if (!key) {
            try {
              const fresh = await cartService.get();
              setItems(fresh.items);
              if (typeof fresh.total === "number") setServerTotal(fresh.total);
              key = fresh.items.find((line) => line.product.id === productId)?.id;
            } catch {
              // Fall through to failure below.
            }
            if (!key) return false;
          }
          if (safeQty <= 0) {
            await cartService.remove(key);
          } else {
            await cartService.update(key, safeQty);
          }
          await refresh();
          return true;
        } catch (err) {
          console.error("[cart updateQty]", err);
          return false;
        }
      }
      const entries = readGuestItems();
      if (safeQty <= 0) {
        writeGuestItems(entries.filter((entry) => entry.productId !== productId));
        setItems((prev) => prev.filter((line) => line.product.id !== productId));
        return true;
      }
      writeGuestItems(
        entries.map((entry) => (entry.productId === productId ? { ...entry, qty: safeQty } : entry)),
      );
      setItems((prev) =>
        prev.map((line) => (line.product.id === productId ? { ...line, qty: safeQty } : line)),
      );
      return true;
    },
    [userId, refresh, items],
  );

  const remove = useCallback(
    async (productId: string): Promise<boolean> => {
      if (userId) {
        try {
          let key = items.find((line) => line.product.id === productId)?.id;
          if (!key) {
            try {
              const fresh = await cartService.get();
              setItems(fresh.items);
              if (typeof fresh.total === "number") setServerTotal(fresh.total);
              key = fresh.items.find((line) => line.product.id === productId)?.id;
            } catch {
              // Fall through to failure below.
            }
            if (!key) return false;
          }
          await cartService.remove(key);
          await refresh();
          return true;
        } catch (err) {
          console.error("[cart remove]", err);
          return false;
        }
      }
      writeGuestItems(readGuestItems().filter((entry) => entry.productId !== productId));
      setItems((prev) => prev.filter((line) => line.product.id !== productId));
      return true;
    },
    [userId, refresh, items],
  );

  const clear = useCallback(async (): Promise<boolean> => {
    if (userId) {
      try {
        await cartService.clear();
      } catch (err) {
        console.error("[cart clear]", err);
        return false;
      }
      await refresh();
      return true;
    }
    eraseCookie(CART_COOKIE);
    setItems([]);
    return true;
  }, [userId, refresh]);

  const count = items.reduce((sum, line) => sum + line.qty, 0);
  const localTotal = items.reduce((sum, line) => sum + line.qty * line.product.price, 0);
  const total = userId && serverTotal !== null ? serverTotal : localTotal;

  return (
    <CartContext.Provider value={{ items, count, total, loading, add, updateQty, remove, clear, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
