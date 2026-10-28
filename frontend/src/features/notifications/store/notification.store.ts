import { create } from "zustand";
import type { NotificationResponseDto } from "../types/notificastion-response.types";


interface NotificationState {
    notifications: NotificationResponseDto[];
    setNotifications: (notifications: NotificationResponseDto[]) => void;
    addNotification: (notification: NotificationResponseDto) => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
    notifications: [],

    setNotifications: (notifications) => set({ notifications }),

    addNotification: (notification) =>
        set((state) => {
            if (state.notifications.some((item) => item.id === notification.id)) {
                return state;
            }

            return {
                notifications: [notification, ...state.notifications],
            };
        }),

    clearNotifications: () => set({ notifications: [] }),
}));