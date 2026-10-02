import axios from "axios";
import { normalizeApiError } from "./ApiError";
import { useAuthStore } from "../../store/auth/auth.store";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const normalizedError = normalizeApiError(error);
        if (normalizedError.status === 401 && error.config) {
            const url = error.config.url || "";
            if (!url.includes('/login') && !url.includes('/otp-varify') && !url.includes('/otp-varification')) {
                useAuthStore.getState().clearAuth();
            }
        }
        return Promise.reject(normalizedError);
    }
);