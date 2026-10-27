import { NotificationType } from "../../../domain/entities/notification.entity";

export interface NotificationResponseDto {
  id: string;
  recipient_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  read_at: Date | null;
  created_at: Date;
}