import { UpdateNotificationData } from "../../../domain/repositories/INotification.repository";

export interface UpdateNotificationRequestDto {
    id:string,
    recipientId: string,
    input:UpdateNotificationData
}