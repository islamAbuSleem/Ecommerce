import { api } from "./api";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  sellerStatus: string | null;
};

type SuccessResponse<T> = {
  success: boolean;
  data?: T;
};

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  role: "buyer" | "seller";
};

function unwrap<T>(data: SuccessResponse<T>): T {
  if (!data.success || !data.data) throw new Error("Request failed");
  return data.data;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthUser> {
    const { data } = await api.post<SuccessResponse<AuthUser>>("/auth/login", { email, password });
    return unwrap(data);
  },

  async register(payload: RegisterPayload): Promise<AuthUser> {
    const { data } = await api.post<SuccessResponse<AuthUser>>("/auth/register", payload);
    return unwrap(data);
  },

  async me(): Promise<AuthUser | null> {
    try {
      const { data } = await api.get<SuccessResponse<AuthUser>>("/auth/me");
      if (!data.success || !data.data) return null;
      return data.data;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.get("/auth/logout");
    } catch {
      // Ignore network errors on logout — callers clear local state regardless.
    }
  },
};
