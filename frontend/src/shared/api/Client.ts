import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";
import { normalizeApiError } from "./ApiError";
import { useAuthStore } from "../../features/auth/stores/auth.store";
import { HttpStatus, AuthErrorCode } from "../constants/auth.constants";

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const NON_REFRESHABLE_ROUTES = [
    "/api/auth/login",
    "/api/auth/refresh",
    "/api/auth/logout",
    "/api/auth/otp-varify",
    "/api/auth/otp-status",
    "/api/auth/resend-otp",
    "/api/auth/email-verify",
    "/api/auth/reset-password",
    "/api/customer/register",
    "/api/provider/pre-register",
    "/api/provider/register"
];

function isNonRefreshableUrl(url?: string): boolean {
    if (!url) return false;
    return NON_REFRESHABLE_ROUTES.some((route) => url.includes(route));
}

export const refreshClient = axios.create({
    baseURL: import.meta.env?.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

export const apiClient = axios.create({
    baseURL: import.meta.env?.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

let refreshPromise: Promise<void> | null = null;

apiClient.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        if (isAxiosError(error)) {
            const status = error.response?.status;
            const data = error.response?.data as { code?: string; message?: string } | undefined;

            if (status === HttpStatus.FORBIDDEN && (data?.code === AuthErrorCode.BLOCKED_ACCOUNT || data?.code === AuthErrorCode.INACTIVE_ACCOUNT)) {
                useAuthStore.getState().clearAuth();

                if (window.location.pathname !== "/login") {
                    window.location.replace("/login");
                }

                return Promise.reject(normalizeApiError(error));
            }
        }

        if (!isAxiosError(error) || !error.config || error.response?.status !== HttpStatus.UNAUTHORIZED) {
            return Promise.reject(normalizeApiError(error));
        }

        const originalRequest = error.config as RetriableRequestConfig;

        if (isNonRefreshableUrl(originalRequest.url)) {
            return Promise.reject(normalizeApiError(error));
        }

        if (originalRequest._retry) {
            useAuthStore.getState().clearAuth();
            return Promise.reject(normalizeApiError(error));
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = refreshClient
                    .post("/api/auth/refresh")
                    .then(() => undefined)
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            await refreshPromise;
            return apiClient(originalRequest);
        } catch (refreshError: unknown) {
            useAuthStore.getState().clearAuth();
            return Promise.reject(normalizeApiError(refreshError));
        }
    }
);
