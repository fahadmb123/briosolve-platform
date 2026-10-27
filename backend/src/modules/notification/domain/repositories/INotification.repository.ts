import { Notification } from "../entities/notification.entity";

export interface CreateNotificationData {
  id?: string;
  recipientId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown> | null;
  isRead?: boolean;
  readAt?: Date | null;
  createdAt?: Date;
}

export interface INotificationRepository {
  create(data: CreateNotificationData): Promise<Notification>;
}