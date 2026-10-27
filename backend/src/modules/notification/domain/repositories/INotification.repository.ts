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

export interface INotificationRepository extends BaseRepository<Notification> {
  
  create(data: CreateNotificationData): Promise<Notification>;

  findByRecipientId(id: string): Promise<Notification[]>;

}