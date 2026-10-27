import { Prisma } from "@prisma/client";
import { Notification } from "../../domain/entities/notification.entity";
import type { NotificationType } from "../../domain/entities/notification.entity";
import { CreateNotificationData } from "../../domain/repositories/INotification.repository";
import { Varchar } from "@prisma/orm-postgres/target/codec-types";

type NotificationPersistence = Prisma.notificationsGetPayload<{}>;

export class NotificationMapper {
  static toDomain(record: NotificationPersistence): Notification {
    return new Notification(
      record.id,
      record.recipient_id,
      record.title,
      record.message,
      this.toNotificationType(record.type),
      record.is_read,
      record.read_at,
      record.created_at,
    );
  }

  private static toNotificationType(value: string): NotificationType {
    switch (value) {
      case "INFO":
      case "SUCCESS":
      case "WARNING":
      case "ERROR":
        return value;
      default:
        throw new Error(`Unsupported notification type: ${value}`);
    }
  }

  static toPersistence(data: CreateNotificationData,): Prisma.notificationsCreateInput {
    return {
      recipient_id: data.recipientId,
      type: data.type as Varchar<100>,
      title: data.title as Varchar<150>,
      message: data.message as Varchar<1000>,
      is_read: data.isRead ?? false,
      read_at: data.readAt ?? null,
      ...(data.id !== undefined && { id: data.id }),
      ...(data.createdAt !== undefined && {
        created_at: data.createdAt,
      }),
    }
  }
}