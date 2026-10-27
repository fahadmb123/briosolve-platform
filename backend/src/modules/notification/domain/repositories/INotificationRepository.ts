import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
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

export interface INotificationRepository extends BaseRepository<Notification | null> {
    create(notification: CreateNotificationData): Promise<Notification>;
    findById(id: string): Promise<Notification | null>;
    findByRecipientId(
        recipientId: string,
        limit: number,
        offset: number
    ): Promise<Notification[]>;
    markAsRead(id: string, recipientId: string): Promise<Notification | null>;
    countUnreadByRecipientId(recipientId: string): Promise<number>;
}