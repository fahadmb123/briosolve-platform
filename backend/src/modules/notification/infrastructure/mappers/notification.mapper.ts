import { Temporal } from "@js-temporal/polyfill";
import type { JsonValue, Varchar } from "@prisma/orm-postgres/target/codec-types";
import type { Prisma } from "@prisma/client";
import { Notification } from "../../domain/entities/notification.entity";
import { CreateNotificationData } from "../../domain/repositories/INotificationRepository";

type NotificationRecord = Prisma.NotificationGetPayload<{}>;
type NotificationCreatePersistenceInput = Prisma.NotificationCreateInput;

export class NotificationMapper {
    static toDomain(record: NotificationRecord): Notification {
        const createdAtRaw: unknown = record.created_at;
        const readAtRaw: unknown = record.read_at;

        const createdAt = (createdAtRaw as { epochMilliseconds?: bigint })?.epochMilliseconds
            ? new Date(Number((createdAtRaw as { epochMilliseconds: bigint }).epochMilliseconds))
            : new Date(createdAtRaw as string | number | Date);

        const readAt = readAtRaw
            ? ((readAtRaw as { epochMilliseconds?: bigint })?.epochMilliseconds
                ? new Date(Number((readAtRaw as { epochMilliseconds: bigint }).epochMilliseconds))
                : new Date(readAtRaw as string | number | Date))
            : null;

        const data = record.data
            ? (typeof record.data === "string"
                ? (JSON.parse(record.data) as Record<string, unknown>)
                : (record.data as Record<string, unknown>))
            : null;

        return new Notification(
            record.id,
            record.recipient_id,
            record.type,
            record.title,
            record.message,
            data,
            record.is_read,
            readAt,
            createdAt
        );
    }

    static toPersistence(notification: CreateNotificationData | Notification): NotificationCreatePersistenceInput {
        const createdAt = notification.createdAt
            ? Temporal.Instant.from(notification.createdAt.toISOString())
            : Temporal.Now.instant();

        const readAt = notification.readAt
            ? Temporal.Instant.from(notification.readAt.toISOString())
            : null;

        return {
            ...(notification.id ? { id: notification.id } : {}),
            recipient_id: notification.recipientId,
            type: notification.type as Varchar<100>,
            title: notification.title as Varchar<150>,
            message: notification.message as Varchar<1000>,
            data: (notification.data ?? null) as JsonValue | null,
            is_read: notification.isRead ?? false,
            read_at: readAt,
            created_at: createdAt
        };
    }
}
