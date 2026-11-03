import { NotificationType } from "../../../domain/entities/notification.entity";

export interface CreateBulkNotificationRequestDto {
    recipientIds: string[];
    title: string;
    title_code: string;
    message: string;
    type: NotificationType;
}