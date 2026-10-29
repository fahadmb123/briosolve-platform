import { useEffect } from "react";
import { socket } from "../../../shared/api/socket-client";
import { useAuthStore } from "../../auth/stores/auth.store";
import { useNotificationStore } from "../store/notification.store";
import { getNotifications } from "../services/notification.service";
import { playNotificationSound } from "../utils/sound.utils";
import type { NotificationResponseDto } from "../types/notificastion-response.types";

export function useNotificationSocket(): void {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const addNotification = useNotificationStore(
        (state) => state.addNotification,
    );
    const setNotifications = useNotificationStore(
        (state) => state.setNotifications,
    );

    useEffect(() => {
        if (!isAuthenticated) {
            socket.disconnect();
            return;
        }

        getNotifications()
            .then((res) => {
                if (res.data) {
                    setNotifications(res.data);
                }
            })
            .catch(() => {});

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
