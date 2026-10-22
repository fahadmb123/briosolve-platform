import axios, { isAxiosError, type InternalAxiosRequestConfig } from "axios";
import { normalizeApiError } from "./ApiError";
import { useAuthStore } from "../../features/auth/stores/auth.store";

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
    _requestStartTime?: number;
}

const REFRESH_LOCK_NAME = "auth_refresh_lock";
const REFRESH_LOCK_TIMEOUT_MS = 10000;
const PEER_CONFIRMATION_TIMEOUT_MS = 1500;
const PEER_REFRESH_MAX_AGE_MS = 10000;
const PEER_CONCURRENT_WINDOW_MS = 2000;
const PEER_CONCURRENT_TOLERANCE_MS = 200;
const PEER_FUTURE_TOLERANCE_MS = 1000;
const AUTH_COORDINATION_CHANNEL = "auth_coordination";
const STORAGE_REFRESH_KEY = "auth_refresh_timestamp";

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
let lastRefreshSuccessTimestamp = 0;
let hasUnresolvedRotation = false;
let unresolvedRotationTimestamp = 0;
const peerSuccessResolvers = new Set<(timestamp: number) => void>();

export function getLastRefreshSuccessTimestamp(): number {
    return lastRefreshSuccessTimestamp;
}

export function getHasUnresolvedRotation(): boolean {
    return hasUnresolvedRotation;
}

export function clearAuthCoordinationState(force = false): void {
    refreshPromise = null;
    lastRefreshSuccessTimestamp = 0;
    hasUnresolvedRotation = false;
    unresolvedRotationTimestamp = 0;
    peerSuccessResolvers.clear();
    try {
        if (typeof localStorage !== "undefined") {
            if (force) {
                localStorage.removeItem(STORAGE_REFRESH_KEY);
            } else {
                const storedData = getStoredRefreshData();
                if (storedData && (Date.now() - storedData.timestamp) > PEER_CONCURRENT_WINDOW_MS) {
                    localStorage.removeItem(STORAGE_REFRESH_KEY);
                }
            }
        }
    } catch {
        return;
    }
}

export function resetAuthCoordinationForTesting(): void {
    clearAuthCoordinationState(true);
}

function isValidRefreshTimestamp(timestamp: number): boolean {
    if (!Number.isFinite(timestamp) || timestamp <= 0) {
        return false;
    }
    const now = Date.now();
    if (timestamp > now + PEER_FUTURE_TOLERANCE_MS) {
        return false;
    }
    if ((now - timestamp) > PEER_REFRESH_MAX_AGE_MS) {
        return false;
    }
    return true;
}

interface StoredRefreshData {
    timestamp: number;
    userId: string | null;
}

function parseStoredRefreshData(raw: string | null): StoredRefreshData | null {
    if (!raw) return null;
    try {
        if (raw.startsWith("{")) {
            const parsed = JSON.parse(raw) as { timestamp?: unknown; userId?: unknown };
            const timestamp = Number(parsed.timestamp);
            if (isValidRefreshTimestamp(timestamp)) {
                return {
                    timestamp,
                    userId: typeof parsed.userId === "string" ? parsed.userId : null
                };
            }
            return null;
        }
        const timestamp = Number(raw);
        if (isValidRefreshTimestamp(timestamp)) {
            return {
                timestamp,
                userId: null
            };
        }
        return null;
    } catch {
        return null;
    }
}

function isSignalCorrelated(signalUserId: string | null | undefined): boolean {
    const currentUserId = useAuthStore.getState().user?.id;
    if (signalUserId && currentUserId && signalUserId !== currentUserId) {
        return false;
    }
    return true;
}

function getStoredRefreshData(): StoredRefreshData | null {
    try {
        if (typeof localStorage !== "undefined") {
            const val = localStorage.getItem(STORAGE_REFRESH_KEY);
            if (val) {
                const data = parseStoredRefreshData(val);
                if (data && isValidRefreshTimestamp(data.timestamp)) {
                    return data;
                }
                localStorage.removeItem(STORAGE_REFRESH_KEY);
            }
        }
    } catch {
        return null;
    }
    return null;
}

function getStoredRefreshSuccessTimestamp(): number {
    const data = getStoredRefreshData();
    if (!data || !isSignalCorrelated(data.userId)) {
        return 0;
    }
    return data.timestamp;
}

function notifyPeerSuccess(timestamp: number, userId?: string | null): void {
    if (!isValidRefreshTimestamp(timestamp) || !isSignalCorrelated(userId)) {
        return;
    }
    lastRefreshSuccessTimestamp = Math.max(lastRefreshSuccessTimestamp, timestamp);
    hasUnresolvedRotation = false;
    unresolvedRotationTimestamp = 0;
    for (const resolve of peerSuccessResolvers) {
        resolve(timestamp);
    }
    peerSuccessResolvers.clear();
}

function recordRefreshSuccess(timestamp: number): void {
    lastRefreshSuccessTimestamp = timestamp;
    hasUnresolvedRotation = false;
    unresolvedRotationTimestamp = 0;
    const currentUserId = useAuthStore.getState().user?.id ?? null;
    try {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(STORAGE_REFRESH_KEY, JSON.stringify({
                timestamp,
                userId: currentUserId
            }));
        }
    } catch {
        return;
    }
    if (broadcastChannel) {
        broadcastChannel.postMessage({
            type: "REFRESH_SUCCESS",
            timestamp,
            userId: currentUserId
        });
    }
}

const broadcastChannel: BroadcastChannel | null =
    typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel(AUTH_COORDINATION_CHANNEL)
        : null;

if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
        if (event.data?.type === "REFRESH_SUCCESS") {
            const timestamp = Number(event.data.timestamp);
            const userId = typeof event.data.userId === "string" ? event.data.userId : null;
            if (isValidRefreshTimestamp(timestamp) && isSignalCorrelated(userId)) {
                notifyPeerSuccess(timestamp, userId);
            }
        } else if (event.data?.type === "REFRESH_FAILURE") {
            clearAuthCoordinationState(false);
            useAuthStore.getState().clearAuth();
        }
    };
}

if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
    window.addEventListener("storage", (event) => {
        if (event.key === STORAGE_REFRESH_KEY && event.newValue) {
            const data = parseStoredRefreshData(event.newValue);
            if (data && isValidRefreshTimestamp(data.timestamp) && isSignalCorrelated(data.userId)) {
                notifyPeerSuccess(data.timestamp, data.userId);
            }
        }
    });
}

if (typeof window !== "undefined") {
    queueMicrotask(() => {
        useAuthStore.subscribe((state, prevState) => {
            if (prevState.isAuthenticated && !state.isAuthenticated) {
                clearAuthCoordinationState(false);
            }
        });
    });
}

function isExcludedAuthEndpoint(url: string | undefined): boolean {
    if (!url) return false;
    return (
        url.includes("/login") ||
        url.includes("/refresh") ||
        url.includes("/logout") ||
        url.includes("/otp-") ||
        url.includes("/email-verify") ||
        url.includes("/reset-password") ||
        url.includes("/pre-register") ||
        url.includes("/register")
    );
}

function isTokenRotatedError(error: unknown): boolean {
    if (!isAxiosError(error) || error.response?.status !== 401) {
        return false;
    }
    const data = error.response.data as { code?: string } | undefined;
    return data?.code === "TOKEN_ROTATED";
}

function waitForPeerSuccess(timeoutMs: number, attemptStartTime: number): Promise<number | null> {
    const minTimestamp = Math.max(
        lastRefreshSuccessTimestamp + 1,
        attemptStartTime - PEER_CONCURRENT_TOLERANCE_MS
    );
    const stored = getStoredRefreshSuccessTimestamp();
    const current = Math.max(lastRefreshSuccessTimestamp, stored);

    if (current >= minTimestamp && isValidRefreshTimestamp(current)) {
        lastRefreshSuccessTimestamp = current;
        hasUnresolvedRotation = false;
        unresolvedRotationTimestamp = 0;
        return Promise.resolve(current);
    }

    return new Promise((resolve) => {
        let timer: ReturnType<typeof setTimeout> | null = null;

        const onConfirmed = (timestamp: number) => {
            if (timestamp >= minTimestamp && isValidRefreshTimestamp(timestamp)) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                peerSuccessResolvers.delete(onConfirmed);
                resolve(timestamp);
            }
        };

        peerSuccessResolvers.add(onConfirmed);

        timer = setTimeout(() => {
            peerSuccessResolvers.delete(onConfirmed);
            resolve(null);
        }, timeoutMs);
    });
}

async function executeRefresh(): Promise<void> {
    if (!refreshPromise) {
        const attemptStartTime = Date.now();
        refreshPromise = refreshClient
            .post("/api/auth/refresh")
            .then(() => {
                recordRefreshSuccess(Date.now());
            })
            .catch(async (refreshError) => {
                if (isTokenRotatedError(refreshError)) {
                    const confirmedPeerTimestamp = await waitForPeerSuccess(
                        PEER_CONFIRMATION_TIMEOUT_MS,
                        attemptStartTime
                    );

                    if (confirmedPeerTimestamp !== null) {
                        lastRefreshSuccessTimestamp = confirmedPeerTimestamp;
                        hasUnresolvedRotation = false;
                        unresolvedRotationTimestamp = 0;
                        return;
                    }

                    hasUnresolvedRotation = true;
                    unresolvedRotationTimestamp = attemptStartTime;
                    throw refreshError;
                }

                clearAuthCoordinationState(false);
                useAuthStore.getState().clearAuth();
                if (broadcastChannel) {
                    broadcastChannel.postMessage({
                        type: "REFRESH_FAILURE",
                        timestamp: Date.now()
                    });
                }
                throw refreshError;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

async function coordinateRefresh(requestStartTime: number): Promise<void> {
    const latestSuccess = Math.max(lastRefreshSuccessTimestamp, getStoredRefreshSuccessTimestamp());
    if (requestStartTime > 0 && requestStartTime < latestSuccess) {
        lastRefreshSuccessTimestamp = latestSuccess;
        hasUnresolvedRotation = false;
        unresolvedRotationTimestamp = 0;
        return;
    }

    if (hasUnresolvedRotation) {
        if (latestSuccess > unresolvedRotationTimestamp && isValidRefreshTimestamp(latestSuccess)) {
            hasUnresolvedRotation = false;
            unresolvedRotationTimestamp = 0;
            lastRefreshSuccessTimestamp = latestSuccess;
            return;
        }

        hasUnresolvedRotation = false;
        unresolvedRotationTimestamp = 0;
        clearAuthCoordinationState(false);
        useAuthStore.getState().clearAuth();
        throw new Error("Session rotation could not be resolved. Please log in again.");
    }

    if (typeof navigator !== "undefined" && navigator.locks) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REFRESH_LOCK_TIMEOUT_MS);

        try {
            await navigator.locks.request(
                REFRESH_LOCK_NAME,
                { signal: controller.signal },
                async () => {
                    clearTimeout(timeoutId);
                    const currentSuccess = Math.max(lastRefreshSuccessTimestamp, getStoredRefreshSuccessTimestamp());
                    if (requestStartTime > 0 && requestStartTime < currentSuccess) {
                        lastRefreshSuccessTimestamp = currentSuccess;
                        hasUnresolvedRotation = false;
                        unresolvedRotationTimestamp = 0;
                        return;
                    }
                    await executeRefresh();
                }
            );
        } catch (err: unknown) {
            clearTimeout(timeoutId);
            const currentSuccess = Math.max(lastRefreshSuccessTimestamp, getStoredRefreshSuccessTimestamp());
            if (requestStartTime > 0 && requestStartTime < currentSuccess) {
                lastRefreshSuccessTimestamp = currentSuccess;
                hasUnresolvedRotation = false;
                unresolvedRotationTimestamp = 0;
                return;
            }
            if (err instanceof Error && err.name === "AbortError") {
                return await executeRefresh();
            }
            throw err;
        }
    } else {
        await executeRefresh();
    }
}

apiClient.interceptors.request.use((config) => {
    (config as RetriableRequestConfig)._requestStartTime = Date.now();
    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        if (hasUnresolvedRotation) {
            hasUnresolvedRotation = false;
            unresolvedRotationTimestamp = 0;
        }
        return response;
    },
    async (error) => {
        if (!isAxiosError(error) || !error.config || error.response?.status !== 401) {
            return Promise.reject(normalizeApiError(error));
        }

        const originalRequest = error.config as RetriableRequestConfig;
        const url = originalRequest.url || "";

        if (isExcludedAuthEndpoint(url)) {
            if (!url.includes("/login") && !url.includes("/otp-varify") && !url.includes("/otp-varification")) {
                useAuthStore.getState().clearAuth();
            }
            return Promise.reject(normalizeApiError(error));
        }

        if (originalRequest._retry) {
            clearAuthCoordinationState(false);
            useAuthStore.getState().clearAuth();
            return Promise.reject(normalizeApiError(error));
        }

        originalRequest._retry = true;

        try {
            await coordinateRefresh(originalRequest._requestStartTime ?? 0);
            return apiClient(originalRequest);
        } catch (refreshError) {
            return Promise.reject(normalizeApiError(refreshError));
        }
    }
);