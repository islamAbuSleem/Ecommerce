import { api } from "./api";

export type ShippingConfig = { configured: boolean };

type SuccessResponse<T> = {
  success: boolean;
  data?: T;
};

function unwrap<T>(data: SuccessResponse<T>): T {
  if (!data.success || data.data == null) throw new Error("Request failed");
  return data.data;
}

export const shippingService = {
  async config(): Promise<ShippingConfig> {
    const { data } = await api.get<SuccessResponse<ShippingConfig>>(
      "/shipping/config",
    );
    return unwrap(data);
  },

  async rates(origin: string, destination: string): Promise<unknown> {
    const { data } = await api.post<SuccessResponse<unknown>>(
      "/shipping/rates",
      { origin, destination },
    );
    return unwrap(data);
  },
};
