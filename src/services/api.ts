import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { auth } from "./auth";

const BASEURL = "https://localhost:7280/api";
export const api = axios.create({
  baseURL: BASEURL, // your API base
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = auth.getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`)
  }
  return config;
});

let isRefreshing = false;
let queue: ((token: string) => void)[] = [];

function subscribe(cb: (token: string) => void) {
  queue.push(cb);
}

function onRefreshed(newToken: string) {
  queue.forEach((cb) => cb(newToken));
  queue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Check if we have a refresh token before attempting to refresh
    const storedRefreshToken = auth.getRefreshToken();
    if (!storedRefreshToken) {
      // No refresh token available, clear auth and reject
      auth.clear();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribe((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;
    try {
      const res = await axios.post(BASEURL + "/auth/refresh", {
        refreshToken: storedRefreshToken
      });

      const { accessToken, refreshToken } = res.data as {
        accessToken: string;
        refreshToken: string;
      };

      auth.saveTokens({ accessToken, refreshToken });

      onRefreshed(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (err) {
      auth.clear();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
