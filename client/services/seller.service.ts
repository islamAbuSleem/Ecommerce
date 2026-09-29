import { api } from "./api";
import type { Product } from "./products.service";

export type SellerRange = "7d" | "30d" | "90d" | "all";

export type SellerOrderLine = {
  productId: string;
  name: string;
  qty: number;
  price: number;
};

export type SellerOrder = {
  id: string;
  createdAt: string;
  /** The seller's own amount for this order — the order total includes other sellers' lines. */
  subtotal: number;
  status: string;
  itemCount: number;
  items: SellerOrderLine[];
};

export type SellerStatusCounts = Record<string, number>;

export type SellerOrderList = {
  items: SellerOrder[];
  total: number;
  statusCounts: SellerStatusCounts;
};

export type SellerProductList = {
  items: Product[];
  total: number;
};

export type SellerLowStockItem = {
  id: string;
  name: string;
  stock: number;
  price: number;
  slug: string;
};

export type SellerStats = {
  gmv: number;
  orderCount: number;
  /** Active listings, whatever their stock level. */
  activeSkuCount: number;
  /** Active listings with stock > 0. */
  inStockSkuCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  /** Server-capped list of the lowest-stock active listings. */
  lowStockItems: SellerLowStockItem[];
  lowStockThreshold: number;
  statusCounts: SellerStatusCounts;
};

export type SellerProductStatus = "active" | "inactive";

export type ProductPayload = {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  freeShipping: boolean;
  status: SellerProductStatus;
};

type SuccessResponse<T> = {
  success: boolean;
  data?: T;
};

function unwrap<T>(data: SuccessResponse<T>): T {
  if (!data.success || data.data == null) throw new Error("Request failed");
  return data.data;
}

export const sellerService = {
  async stats(range: SellerRange): Promise<SellerStats> {
    const { data } = await api.get<SuccessResponse<SellerStats>>("/seller/stats", {
      params: { range },
    });
    return unwrap(data);
  },

  async products(): Promise<SellerProductList> {
    const { data } = await api.get<SuccessResponse<SellerProductList>>("/seller/products");
    return unwrap(data);
  },

  async createProduct(payload: ProductPayload): Promise<Product> {
    const { data } = await api.post<SuccessResponse<Product>>("/seller/products", payload);
    return unwrap(data);
  },

  async updateProduct(id: string, payload: ProductPayload): Promise<Product> {
    const { data } = await api.patch<SuccessResponse<Product>>(`/seller/products/${id}`, payload);
    return unwrap(data);
  },

  async orders(): Promise<SellerOrderList> {
    const { data } = await api.get<SuccessResponse<SellerOrderList>>("/seller/orders");
    return unwrap(data);
  },
};
