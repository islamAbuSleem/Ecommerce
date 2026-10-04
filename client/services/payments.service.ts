import { api } from "./api";

export type PaymentsConfig = { configured: boolean };
export type CheckoutSession = { url: string };

type SuccessResponse<T> = {
  success: boolean;
  data?: T;
};

function unwrap<T>(data: SuccessResponse<T>): T {
  if (!data.success || data.data == null) throw new Error("Request failed");
  return data.data;
}

export const paymentsService = {
  async config(): Promise<PaymentsConfig> {
    const { data } = await api.get<SuccessResponse<PaymentsConfig>>(
      "/payments/config",
    );
    return unwrap(data);
  },

  async checkout(orderId: string): Promise<CheckoutSession> {
    const { data } = await api.post<SuccessResponse<CheckoutSession>>(
      "/payments/checkout",
      { orderId },
    );
    return unwrap(data);
  },
};
