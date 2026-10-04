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

export type AdminAnalyticsRange = "7d" | "30d" | "90d" | "all";

export type AdminAnalyticsKpis = {
  gmv: number;
  orderCount: number;
  approvedSellers: number;
  pendingApplications: number;
};

export type AdminAnalyticsSeriesPoint = {
  day: string;
  orders: number;
  gmv: number;
};

export type AdminAnalyticsCategory = {
  category: string;
  gmv: number;
  units: number;
  /** Whole-percentage share of total GMV, 0..100. */
  share: number;
};

export type AdminAnalyticsTopSeller = {
  sellerId: string;
  name: string | null;
  gmv: number;
  orders: number;
};

export type AdminAnalyticsLowStockItem = {
  id: string;
  name: string;
  stock: number;
  price: number;
  sellerName: string | null;
};

export type AdminAnalyticsLowStock = {
  threshold: number;
  count: number;
  outOfStockCount: number;
  items: AdminAnalyticsLowStockItem[];
};

export type AdminAnalytics = {
  range: AdminAnalyticsRange;
  kpis: AdminAnalyticsKpis;
  series: AdminAnalyticsSeriesPoint[];
  seriesLabel: string;
  categories: AdminAnalyticsCategory[];
  topSellers: AdminAnalyticsTopSeller[];
  lowStock: AdminAnalyticsLowStock;
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
  async analytics(range: AdminAnalyticsRange = "30d"): Promise<AdminAnalytics> {
    const { data } = await api.get<SuccessResponse<AdminAnalytics>>("/admin/analytics", {
      params: { range },
    });
    return unwrap(data);
  },

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
