import { useEffect } from "react";
import { socket } from "../../../shared/api/socket-client";
import { useAuthStore } from "../../auth/stores/auth.store";
import { useNotificationStore } from "../store/notification.store";
import type { NotificationResponseDto } from "../types/notificastion-response.types";


export function useNotificationSocket(): void {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const addNotification = useNotificationStore(
        (state) => state.addNotification,
    );

    useEffect(() => {
        if (!isAuthenticated) {
            socket.disconnect();
            return;
        }

        const handleNewNotification = (notification: NotificationResponseDto) => {
            addNotification(notification);
        }

        socket.on("notification:new", handleNewNotification);
        socket.connect();

        return () => {
            socket.off("notification:new", handleNewNotification);
            socket.disconnect();
        };
    }, [isAuthenticated, addNotification]);
}