import { api } from "./api";

export type DeliveryMethod = "standard" | "express";

export type CreateOrderPayload = {
  fullName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  deliveryMethod: DeliveryMethod;
};

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  status: string;
  total: number;
  subtotal?: number;
  shippingCost?: number;
  deliveryMethod?: DeliveryMethod;
  fullName?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
  items: OrderItem[];
  createdAt?: string;
  productImages?: Record<string, string | null>;
};

type SuccessResponse<T> = {
  success: boolean;
  data?: T;
};

function unwrap<T>(data: SuccessResponse<T>): T {
  if (!data.success || data.data == null) throw new Error("Request failed");
  return data.data;
}

export type OrderPage = {
  items: Order[];
  hasMore: boolean;
};

export const ordersService = {
  async list(limit?: number, offset?: number): Promise<OrderPage> {
    const params: Record<string, number> = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    const { data } = await api.get<SuccessResponse<OrderPage>>("/orders", {
      params: Object.keys(params).length > 0 ? params : undefined,
    });
    return unwrap(data);
  },

  async create(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await api.post<SuccessResponse<Order>>("/orders", payload);
    return unwrap(data);
  },

  async getById(id: string): Promise<Order> {
    const { data } = await api.get<SuccessResponse<Order>>(`/orders/${id}`);
    return unwrap(data);
  },
};
