import { api } from "./api";

export type AdminRole = "buyer" | "seller" | "admin";

export type AdminSellerStatus = "pending" | "approved" | "rejected";

export type AdminApplicationFilter = AdminSellerStatus | "all";

export type AdminDecision = "approve" | "decline";

export type SellerApplicationSummary = {
  id: string;
  email: string;
  fullName: string | null;
  role: AdminRole;
  /** Null while the account has never requested the seller role. */
  sellerStatus: AdminSellerStatus | null;
  createdAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;
  reviewedByName: string | null;
  productCount: number;
};

export type SellerApplicationProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "deleted";
  category: string | null;
};

export type SellerApplicationDetail = SellerApplicationSummary & {
  updatedAt: string;
  products: SellerApplicationProduct[];
};

export type SellerApplicationList = {
  items: SellerApplicationSummary[];
  total: number;
};

export type SellerApplicationDecision = {
  id: string;
  role: AdminRole;
  sellerStatus: AdminSellerStatus | null;
  reviewedAt: string;
  reviewNote: string | null;
};

export type SellerApplicationDecisionPayload = {
  decision: AdminDecision;
  note?: string;
};

type SuccessResponse<T> = {
  success: boolean;
  data?: T;
};

function unwrap<T>(data: SuccessResponse<T>): T {
  if (!data.success || data.data == null) throw new Error("Request failed");
  return data.data;
}

export const adminService = {
  async sellerApplications(status: AdminApplicationFilter): Promise<SellerApplicationList> {
    const { data } = await api.get<SuccessResponse<SellerApplicationList>>(
      "/admin/seller-applications",
      { params: { status } },
    );
    return unwrap(data);
  },

  async sellerApplication(id: string): Promise<SellerApplicationDetail> {
    const { data } = await api.get<SuccessResponse<SellerApplicationDetail>>(
      `/admin/seller-applications/${id}`,
    );
    return unwrap(data);
  },

  async decideSellerApplication(
    id: string,
    payload: SellerApplicationDecisionPayload,
  ): Promise<SellerApplicationDecision> {
    const { data } = await api.patch<SuccessResponse<SellerApplicationDecision>>(
      `/admin/seller-applications/${id}`,
      payload,
    );
    return unwrap(data);
  },
};
