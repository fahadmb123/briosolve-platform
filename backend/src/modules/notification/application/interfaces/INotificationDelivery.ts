import { NotificationResponseDto } from "../dtos/response/notification-response.dto";

export interface INotificationDelivery {
    deliver(notification: NotificationResponseDto): void;
}
