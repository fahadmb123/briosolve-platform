import type { Prisma } from "@prisma/client";
import { Notification } from "../../domain/entities/notification.entity";

export type NotificationRecord = Prisma.NotificationGetPayload<{}>;

export class NotificationMapper {
  static toDomain(record: NotificationRecord): Notification {
    const createdAtRaw: any = record.created_at;
    const createdAt = createdAtRaw?.epochMilliseconds
      ? new Date(Number(createdAtRaw.epochMilliseconds))
      : new Date(createdAtRaw);

    return new Notification(
      record.id,
      record.recipient_id,
      record.title,
      record.message,
      record.type as Notification["type"],
      NotificationMapper.toData(record.data),
      record.is_read,
      createdAt,
    );
  }

  private static toData(
    data: unknown,
  ): Record<string, unknown> | null {
    if (
      typeof data !== "object" ||
      data === null ||
      Array.isArray(data)
    ) {
      return null;
    }

    return data as Record<string, unknown>;
  }
}