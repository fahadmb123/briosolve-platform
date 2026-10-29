import { apiClient } from "../../../shared/api/Client";
import type { NotificationResponseDto } from "../types/notificastion-response.types";
import type { response } from "../../../shared/types/Dtos";

export const getNotifications = async (): Promise<response<NotificationResponseDto[]>> => {
    const res = await apiClient.get<response<NotificationResponseDto[]>>("/api/notification");
    return res.data;
};

export const markAllNotificationsAsRead = async (): Promise<response<NotificationResponseDto[]>> => {
    const res = await apiClient.patch<response<NotificationResponseDto[]>>("/api/notification", {
        isRead: true,
    });
    return res.data;
};

export const updateNotificationStatus = async (id: string,data: { isRead?: boolean; readAt?: Date | null }): Promise<response<NotificationResponseDto>> => {
    const res = await apiClient.patch<response<NotificationResponseDto>>(`/api/notification/${id}`, data);
    return res.data;
};

