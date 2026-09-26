import { api } from "./api";
import type { Product } from "./products.service";

export type CartLine = {
  id?: string;
  product: Product;
  qty: number;
};

export type Cart = {
  items: CartLine[];
  total: number;
};

export type GuestCartItem = {
  productId: string;
  qty: number;
};

type SuccessResponse<T> = {
  success: boolean;
  data?: T;
};

function unwrap<T>(data: SuccessResponse<T>): T {
  if (!data.success || data.data == null) throw new Error("Request failed");
  return data.data;
}

function calcTotal(items: CartLine[]): number {
  return items.reduce((sum, line) => sum + line.qty * line.product.price, 0);
}

function normalizeCart(data: Cart | CartLine[]): Cart {
  if (Array.isArray(data)) return { items: data, total: calcTotal(data) };
  const items = data.items ?? [];
  return {
    items,
    total: typeof data.total === "number" ? data.total : calcTotal(items),
  };
}

export const cartService = {
  async get(): Promise<Cart> {
    const { data } = await api.get<SuccessResponse<Cart | CartLine[]>>("/cart");
    return normalizeCart(unwrap(data));
  },

  async add(productId: string, qty = 1): Promise<Cart> {
    const { data } = await api.post<SuccessResponse<Cart | CartLine[]>>("/cart/items", {
      productId,
      qty,
    });
    return normalizeCart(unwrap(data));
  },

  async update(id: string, qty: number): Promise<Cart> {
    const { data } = await api.patch<SuccessResponse<Cart | CartLine[]>>(
      `/cart/items/${id}`,
      { qty },
    );
    return normalizeCart(unwrap(data));
  },

  async remove(id: string): Promise<Cart> {
    const { data } = await api.delete<SuccessResponse<Cart | CartLine[]>>(
      `/cart/items/${id}`,
    );
    return normalizeCart(unwrap(data));
  },

  async clear(): Promise<Cart> {
    const { data } = await api.delete<SuccessResponse<Cart | CartLine[]>>("/cart");
    return normalizeCart(unwrap(data));
  },

  async merge(items: GuestCartItem[]): Promise<Cart> {
    const { data } = await api.post<SuccessResponse<Cart | CartLine[]>>("/cart/merge", {
      items,
    });
    return normalizeCart(unwrap(data));
  },
};
