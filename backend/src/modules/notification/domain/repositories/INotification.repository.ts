import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { Notification } from "../entities/notification.entity";

export interface CreateNotificationData {
    id?: string;
    recipientId: string;
    type: string;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date | null;
    createdAt?: Date;
}

export interface UpdateNotificationData {
  type?: string;
  title?: string;
  message?: string;
  is_read?: boolean;
  read_at?: Date | null;
}

export interface INotificationRepository extends BaseRepository<Notification | null> {
  create(data: CreateNotificationData): Promise<Notification>;
  findByRecipientId(id: string): Promise<Notification[]>;
  update(id: string,data:UpdateNotificationData): Promise<Notification | null>;
  markAllAsRead(recipientId: string): Promise<Notification[] | null>;
  getUnreadCount(recipientId: string): Promise<number>
}