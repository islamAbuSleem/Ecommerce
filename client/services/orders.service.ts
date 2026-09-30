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
};

type SuccessResponse<T> = {
  success: boolean;
  data?: T;
};

function unwrap<T>(data: SuccessResponse<T>): T {
  if (!data.success || data.data == null) throw new Error("Request failed");
  return data.data;
}

export const ordersService = {
  async list(limit?: number): Promise<Order[]> {
    const { data } = await api.get<SuccessResponse<Order[]>>("/orders", {
      params: limit ? { limit } : undefined,
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
