import { api } from "./api";

export type CommissionBreakdown = {
  rate: number;
  orderCount: number;
  gross: number;
  commission: number;
  net: number;
};

type SuccessResponse<T> = {
  success: boolean;
  data?: T;
};

function unwrap<T>(data: SuccessResponse<T>): T {
  if (!data.success || data.data == null) throw new Error("Request failed");
  return data.data;
}

export const commissionService = {
  async seller(): Promise<CommissionBreakdown> {
    const { data } = await api.get<SuccessResponse<CommissionBreakdown>>(
      "/commission/seller",
    );
    return unwrap(data);
  },

  async admin(): Promise<CommissionBreakdown> {
    const { data } = await api.get<SuccessResponse<CommissionBreakdown>>(
      "/commission/admin",
    );
    return unwrap(data);
  },
};
