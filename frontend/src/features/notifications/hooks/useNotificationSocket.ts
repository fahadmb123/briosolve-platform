import { useEffect, useRef } from "react";
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
    const fetchRef = useRef(getNotificationsMutation.mutate);
    fetchRef.current = getNotificationsMutation.mutate;

    useEffect(() => {
        if (!isAuthenticated) {
            socket.disconnect();
            return;
        }

        fetchRef.current(undefined, {
            onSuccess: (res) => {
                if (res?.data) {
                    setNotifications(res.data);
                }
            },
        });

        const handleNewNotification = (notification: NotificationResponseDto) => {
            addNotification(notification);
            playNotificationSound();
        };

        socket.on("notification:new", handleNewNotification);
        socket.connect();

        return () => {
            socket.off("notification:new", handleNewNotification);
            socket.disconnect();
        };
    }, [isAuthenticated, addNotification, setNotifications]);
}
