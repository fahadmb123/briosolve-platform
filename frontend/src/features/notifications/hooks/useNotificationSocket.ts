import { useEffect } from "react";
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
    

    useEffect(() => {
        if (!isAuthenticated) {
            socket.disconnect();
            return;
        }

        getNotificationsMutation.mutate(undefined, {
            onSuccess: (res) => {
                if (res?.data) {
                    setNotifications(res.data);
                }
            },
        });

        const handleNewNotification = (notification: NotificationResponseDto) => {
            if (
                notification.title_code === "ACCOUNT_SUSPENDED" ||
                notification.title === "ACCOUNT_SUSPENDED" ||
                notification.title === "Account Suspended"
            ) {
                useAuthStore.getState().clearAuth();
                useAuthStore.getState().setSuspended(true);
                return;
            }
            addNotification(notification);
            playNotificationSound();
        };

        const handleConnect = () => {
            console.log("Notification socket connected successfully");
        };

        const handleConnectError = (error: Error) => {
            console.error("Notification socket connection error:", error.message);
        };

        socket.on("connect", handleConnect);
        socket.on("connect_error", handleConnectError);
        socket.on("notification:new", handleNewNotification);
        socket.connect();

        return () => {
            socket.off("connect", handleConnect);
            socket.off("connect_error", handleConnectError);
            socket.off("notification:new", handleNewNotification);
            socket.disconnect();
        };
    }, [isAuthenticated, addNotification, setNotifications]);
}
