import { useEffect, useCallback } from "react";
import { socket } from "../../../shared/api/socket-client";
import { useAuthStore } from "../../auth/stores/auth.store";
import { useNotificationStore } from "../stores/notification.store";
import { useGetNotifications } from "./useNotifications";
import { playNotificationSound } from "../utils/sound.utils";
import type { NotificationResponseDto } from "../types/notification.types";

export function useNotificationSocket(): void {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const addNotification = useNotificationStore(
        (state) => state.addNotification,
    );
    const setNotifications = useNotificationStore(
        (state) => state.setNotifications,
    );
    const getNotificationsMutation = useGetNotifications();

    const fetchLatestNotifications = useCallback(() => {
        if (!isAuthenticated) return;
        getNotificationsMutation.mutate(undefined, {
            onSuccess: (res) => {
                if (res?.data) {
                    const items = Array.isArray(res.data) ? res.data : res.data.notifications || [];
                    setNotifications(items);
                }
            },
        });
    }, [isAuthenticated, setNotifications]);

    useEffect(() => {
        if (!isAuthenticated) {
            socket.disconnect();
            return;
        }

        fetchLatestNotifications();

        const handleNewNotification = (notification: NotificationResponseDto) => {
            if (
                notification.title_code === "ACCOUNT_SUSPENDED" ||
                notification.title === "ACCOUNT_SUSPENDED" ||
                notification.title === "Account Suspended"
            ) {
                useAuthStore.setState({
                    user: null,
                    profile: null,
                    verifications: null,
                    isAuthenticated: false,
                    isSuspended: true,
                });
                return;
            }
            addNotification(notification);
            playNotificationSound();
            window.dispatchEvent(new CustomEvent("app:notification", { detail: notification }));
            fetchLatestNotifications();
        };

        const handleConnect = () => {
            fetchLatestNotifications();
        };

        const handleFocus = () => {
            fetchLatestNotifications();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchLatestNotifications();
            }
        };

        socket.on("connect", handleConnect);
        socket.on("notification:new", handleNewNotification);
        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        socket.connect();

        return () => {
            socket.off("connect", handleConnect);
            socket.off("notification:new", handleNewNotification);
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            socket.disconnect();
        };
    }, [isAuthenticated, addNotification, fetchLatestNotifications]);
}
