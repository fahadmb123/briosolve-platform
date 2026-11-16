import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/database/client";
import { Notification } from "../../domain/entities/notification.entity";
import { NotificationMapper } from "../mappers/notification.mapper";
import {
    CreateNotificationData,
    FindNotificationsOptions,
    INotificationRepository,
    PaginatedNotificationsResult,
    UpdateNotificationData,
} from "../../domain/repositories/INotification.repository";
import { CreateNotificationRequestDto } from "../../application/dtos/request/create-notificastion.dto";

export class PrismaNotificationRepository implements INotificationRepository {

    async findById(id: string): Promise<Notification | null> {
        const record = await db.orm.public.notifications
            .where({ id: id })
            .first();

        if (!record) return null;

        return NotificationMapper.toDomain(record!);
    }

    async create(data: CreateNotificationData): Promise<Notification> {
        const record = await db.orm.public.notifications
            .create(
                NotificationMapper.toPersistence(data)
            );

        return NotificationMapper.toDomain(record);
    }

    async findByRecipientId(id: string, options?: FindNotificationsOptions): Promise<Notification[]> {
        const query = db.orm.public.notifications.where({ recipient_id: id });
        if (options?.unreadOnly) {
            query.where({ is_read: false });
        }
        query.orderBy((n) => n.created_at.desc());

        if (options?.limit) {
            const page = options.page || 1;
            const skip = (page - 1) * options.limit;
            query.offset(skip).limit(options.limit);
        }

        const record = await query.all();

        return record.map((rec) => {
            return NotificationMapper.toDomain(rec);
        });
    }

    async findPaginatedByRecipientId(id: string, options?: FindNotificationsOptions): Promise<PaginatedNotificationsResult> {
        const page = Math.max(1, options?.page || 1);
        const limit = Math.max(1, options?.limit || 5);
        const skip = (page - 1) * limit;

        const countQuery = db.orm.public.notifications.where({ recipient_id: id });
        if (options?.unreadOnly) {
            countQuery.where({ is_read: false });
        }
        const totalResult = await countQuery.aggregate((agg) => ({ total: agg.count() }));
        const total = Number(totalResult.total ?? 0);
        const totalPages = Math.ceil(total / limit) || 1;

        const listQuery = db.orm.public.notifications.where({ recipient_id: id });
        if (options?.unreadOnly) {
            listQuery.where({ is_read: false });
        }
        listQuery.orderBy((n) => n.created_at.desc()).offset(skip).limit(limit);

        const records = await listQuery.all();
        const notifications = records.map((rec) => NotificationMapper.toDomain(rec));

        return {
            notifications,
            total,
            totalPages
        };
    }

    async update(id: string, data: UpdateNotificationData): Promise<Notification | null> {
        const record = await db.orm.public.notifications
            .where({ id: id })
            .update(
                NotificationMapper.toPersistenceUpdate(data)
            );
        
        if (!record) return null;

        return NotificationMapper.toDomain(record);
    }

    async markAllAsRead(recipientId: string): Promise<Notification[] | null> {
        const record = await db.orm.public.notifications
            .where({ recipient_id: recipientId })
            .updateAll({
                is_read: true,
                read_at: Temporal.Now.instant()
            });
        
        if (!record) return null;

        return record.map((rec) => {
            return NotificationMapper.toDomain(rec);
        });
    }

    async getUnreadCount(recipientId: string): Promise<number> {
        const result = await db.orm.public.notifications
            .where({
                recipient_id: recipientId,
                is_read: false
            })
            .aggregate((agg) => ({ total: agg.count() }));

        return Number(result.total ?? 0);
    }

    async createMany(data: CreateNotificationRequestDto[]): Promise<Notification[] | null> {
        return await db.transaction(async (tx) => {
            const results: Notification[] = [];
            for (const item of data) {
                const record = await tx.orm.public.notifications.create(
                    NotificationMapper.toPersistence(item) as never
                );
                results.push(NotificationMapper.toDomain(record));
            }
            return results;
        });
    }
}
