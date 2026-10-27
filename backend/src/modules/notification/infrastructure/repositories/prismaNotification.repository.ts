import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { Notification } from "../../domain/entities/notification.entity";
import { CreateNotificationData, INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { NotificationMapper } from "../mappers/notification.mapper";


export class PrismaNotificationRepository implements INotificationRepository {
    async create(notification: CreateNotificationData): Promise<Notification> {
        const record = await db.orm.public.notifications.create(
            NotificationMapper.toPersistence(notification)
        )

        return NotificationMapper.toDomain(record);
    }

    async findById(id: string): Promise<Notification | null> {
        const record = await db.orm.public.notifications
            .where({ id })
            .first();

        return record ? NotificationMapper.toDomain(record) : null;
    }

    async findByRecipientId(
        recipientId: string,
        limit: number,
        offset: number
    ): Promise<Notification[]> {
        const records = await db.orm.public.notifications
            .where({ recipient_id: recipientId })
            .orderBy((n) => n.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all();

        return records.map((record) => NotificationMapper.toDomain(record));
    }

    async markAsRead(id: string, recipientId: string): Promise<Notification | null> {
        await db.orm.public.notifications
            .where({
                id,
                recipient_id: recipientId,
                is_read: false,
            })
            .update({
                is_read: true,
                read_at: Temporal.Now.instant(),
            });

        return this.findOwnedNotification(id, recipientId);
    }

    async countUnreadByRecipientId(recipientId: string): Promise<number> {
        const result = await db.orm.public.notifications
            .where({
                recipient_id: recipientId,
                is_read: false,
            })
            .aggregate((agg) => ({ count: agg.count() }));

        return result.count;
    }

    private async findOwnedNotification(
        id: string,
        recipientId: string
    ): Promise<Notification | null> {
        const record = await db.orm.public.notifications
            .where({
                id,
                recipient_id: recipientId,
            })
            .first();

        return record ? NotificationMapper.toDomain(record) : null;
    }
}