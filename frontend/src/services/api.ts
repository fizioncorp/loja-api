import axios from "axios";
import {
  clearStoredSession,
  getStoredToken,
  notifyUnauthorized,
} from "@/features/auth/utils/session";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredSession();
      notifyUnauthorized();
    }

    return Promise.reject(error);
  },
);
