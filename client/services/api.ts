import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

function getMessage(payload: unknown): string | null {
  if (payload && typeof payload === "object") {
    const record = payload as { message?: unknown };
    if (Array.isArray(record.message)) return record.message.join(", ");
    if (typeof record.message === "string" && record.message.length > 0) {
      return record.message;
    }
  }
  return null;
}

api.interceptors.response.use(
  (response) => {
    const payload = response.data as { success?: unknown } | null;
    if (payload && typeof payload === "object" && "success" in payload && payload.success === false) {
      throw new Error(getMessage(payload) ?? "Request failed");
    }
    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<{ message?: string | string[] }>;
      if (!err.response) {
        return Promise.reject(new Error("Something went wrong. Try again."));
      }
      if (err.response.status === 401) {
        return Promise.reject(
          new Error(getMessage(err.response.data) ?? "Session expired. Please sign in again."),
        );
      }
      return Promise.reject(
        new Error(getMessage(err.response.data) ?? "Something went wrong. Try again."),
      );
    }
    return Promise.reject(error instanceof Error ? error : new Error("Something went wrong. Try again."));
  },
);
