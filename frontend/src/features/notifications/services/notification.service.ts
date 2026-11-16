import { apiClient } from "../../../shared/api/Client";
import type {
    NotificationResponseDto,
    PaginatedNotificationsResponseDto,
    PushSubscriptionPayload,
    UnsubscribePushPayload,
} from "../types/notification.types";
import type { response } from "../../../shared/types/Dtos";

export interface GetNotificationsParams {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
}

export const getNotifications = async (
    params?: GetNotificationsParams
): Promise<response<PaginatedNotificationsResponseDto | NotificationResponseDto[]>> => {
    const res = await apiClient.get<response<PaginatedNotificationsResponseDto | NotificationResponseDto[]>>(
        "/api/notification",
        { params }
    );
    return res.data;
};

export const markAllNotificationsAsRead = async (): Promise<response<NotificationResponseDto[]>> => {
    const res = await apiClient.patch<response<NotificationResponseDto[]>>("/api/notification", {
        isRead: true,
    });
    return res.data;
};

export const updateNotificationStatus = async (
    id: string,
    data: { isRead?: boolean; readAt?: Date | null },
): Promise<response<NotificationResponseDto>> => {
    const res = await apiClient.patch<response<NotificationResponseDto>>(`/api/notification/${id}`, data);
    return res.data;
};

export const subscribePushNotificationApi = async (
    data: PushSubscriptionPayload,
): Promise<response<void>> => {
    const res = await apiClient.post<response<void>>("/api/notification/push/subscribe", data);
    return res.data;
};

export const unsubscribePushNotificationApi = async (
    data: UnsubscribePushPayload,
): Promise<response<void>> => {
    const res = await apiClient.post<response<void>>("/api/notification/push/unsubscribe", data);
    return res.data;
};
