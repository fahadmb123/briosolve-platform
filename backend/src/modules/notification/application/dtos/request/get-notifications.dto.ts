import { NotificationResponseDto } from "../response/notification-response.dto";

export interface GetNotificationRequestDto {
    recipientId: string;
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
}

export interface PaginatedNotificationsResponseDto {
    notifications: NotificationResponseDto[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}
