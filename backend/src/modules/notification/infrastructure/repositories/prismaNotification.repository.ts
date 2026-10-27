import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { Notification } from "../../domain/entities/notification.entity";
import { CreateNotificationData, INotificationRepository } from "../../domain/repositories/INotification.repository";
import { NotificationMapper, NotificationRecord } from "../mappers/notification.mapper";

export class PrismaNotificationRepository implements INotificationRepository {
  async create(data: CreateNotificationData): Promise<Notification> {
    const record = await db.orm.public.notifications.create({
      recipient_id: data.recipientId as never,
      type: data.type as never,
      title: data.title as never,
      message: data.message as never,
      data: (data.data ?? null) as never,
      is_read: data.isRead ?? false,
    } as never);

    return NotificationMapper.toDomain(record as unknown as NotificationRecord);
  }
}