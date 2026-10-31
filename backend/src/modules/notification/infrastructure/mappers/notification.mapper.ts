import { Temporal } from "@js-temporal/polyfill";
import { Prisma } from "@prisma/client";
import { Notification } from "../../domain/entities/notification.entity";
import type { NotificationType } from "../../domain/entities/notification.entity";
import { CreateNotificationData, UpdateNotificationData } from "../../domain/repositories/INotification.repository";
import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { NotificationResponseDto } from "../../application/dtos/response/notification-response.dto";

type NotificationPersistence = Prisma.notificationsGetPayload<{}>;

export class NotificationMapper {
    static toDomain(record: NotificationPersistence): Notification {
        let readAt: Date | null = null;
        if (record.read_at) {
            readAt = record.read_at instanceof Date
                ? record.read_at
                : new Date((record.read_at as any).epochMilliseconds ?? String(record.read_at));
        }

        let createdAt: Date;
        if (record.created_at instanceof Date) {
            createdAt = record.created_at;
        } else {
            createdAt = new Date((record.created_at as any).epochMilliseconds ?? String(record.created_at));
        }

        return new Notification(
            record.id,
            record.recipient_id,
            record.title,
            record.title_code,
            record.message,
            this.toNotificationType(record.type),
            record.is_read,
            readAt,
            createdAt,
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

    static toPersistence(data: CreateNotificationData): Prisma.notificationsCreateInput {
        let readAt: any = null;
        if (data.readAt instanceof Date) {
            readAt = Temporal.Instant.fromEpochMilliseconds(data.readAt.getTime());
        } else if (data.readAt) {
            readAt = data.readAt;
        }

        let createdAt: any = undefined;
        if (data.createdAt instanceof Date) {
            createdAt = Temporal.Instant.fromEpochMilliseconds(data.createdAt.getTime());
        } else if (data.createdAt) {
            createdAt = data.createdAt;
        }

        return {
            recipient_id: data.recipientId,
            type: data.type as Varchar<100>,
            title: data.title as Varchar<150>,
            title_code:data.title_code as Varchar<150>,
            message: data.message as Varchar<1000>,
            is_read: data.isRead ?? false,
            read_at: readAt,
            ...(data.id !== undefined && { id: data.id }),
            ...(createdAt !== undefined && { created_at: createdAt }),
        };
    }

    static toPersistenceUpdate(data: UpdateNotificationData): Record<string, any> {
        const update: Record<string, any> = {};

        if (data.type !== undefined) update.type = data.type;
        if (data.title !== undefined) update.title = data.title;
        if (data.message !== undefined) update.message = data.message;

        const isRead = data.is_read !== undefined ? data.is_read : (data as any).isRead;
        if (isRead !== undefined) {
            update.is_read = isRead;
        }

        const readAt = data.read_at !== undefined ? data.read_at : (data as any).readAt;
        if (readAt !== undefined) {
            if (readAt === null) {
                update.read_at = null;
            } else if (readAt instanceof Date) {
                update.read_at = Temporal.Instant.fromEpochMilliseconds(readAt.getTime());
            } else if (typeof readAt === "string") {
                update.read_at = Temporal.Instant.from(readAt);
            } else {
                update.read_at = readAt;
            }
        }

        return update;
    }

    static toDto(record: Notification): NotificationResponseDto {
        return new Notification(
            record.id,
            record.recipient_id,
            record.title,
            record.title_code,
            record.message,
            this.toNotificationType(record.type),
            record.is_read,
            record.read_at,
            record.created_at,
        );
    }
}
