import { api } from "./api";

export type ProductSeller = {
  id: string;
  fullName: string | null;
  sellerStatus: string | null;
};

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  images: string[];
  stock: number;
  status: "active" | "inactive" | "deleted";
  category: string;
  ratingAvg: number;
  ratingCount: number;
  freeShipping: boolean;
  seller?: ProductSeller | null;
};

export type ProductSort = "newest" | "price-asc" | "price-desc" | "rating";

export type ListParams = {
  q?: string;
  category?: string;
  maxPrice?: number;
  minRating?: number;
  freeShipping?: boolean;
  verifiedSeller?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
};

export type ProductList = {
  items: Product[];
  total: number;
};

type SuccessResponse<T> = {
  success: boolean;
  data?: T;
};

function unwrap<T>(data: SuccessResponse<T>): T {
  if (!data.success || data.data == null) throw new Error("Request failed");
  return data.data;
}

function cleanParams(params: ListParams): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    out[key] = value;
  }
  return out;
}

export const productsService = {
  async list(params: ListParams = {}): Promise<ProductList> {
    const { data } = await api.get<SuccessResponse<ProductList>>("/products", {
      params: cleanParams(params),
    });
    return unwrap(data);
  },

  async getById(id: string): Promise<Product> {
    const { data } = await api.get<SuccessResponse<Product>>(`/products/${id}`);
    return unwrap(data);
  },
};
