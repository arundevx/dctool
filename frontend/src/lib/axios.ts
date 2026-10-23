import axios from "axios";
import { useAuthStore } from "./store/auth";
import { getApiBaseUrl } from "./api-base";

export const api = axios.create({
  baseURL: getApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && error.response?.data?.detail?.includes("Guest usage limit")) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth?limit=true";
      }
    }
    return Promise.reject(error);
  }
);
