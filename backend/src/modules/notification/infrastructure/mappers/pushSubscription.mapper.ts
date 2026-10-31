import { Prisma } from "@prisma/client";
import { PushSubscription } from "../../domain/entities/pushSubscription.entity";

type PushSubscriptionPersistence = Prisma.push_subscriptionsGetPayload<{}>;

export class PushSubscriptionMapper {
    static toDomain(record: PushSubscriptionPersistence): PushSubscription {
        let createdAt: Date;
        if (record.created_at instanceof Date) {
            createdAt = record.created_at;
        } else {
            createdAt = new Date((record.created_at as any).epochMilliseconds ?? String(record.created_at));
        }

        return new PushSubscription(
            record.id,
            record.user_id,
            record.endpoint,
            record.p256dh,
            record.auth,
            createdAt
        );
    }

    static toPersistence(entity: Omit<PushSubscription, "id" | "createdAt">): Prisma.push_subscriptionsCreateInput {
        return {
            user_id: entity.userId,
            endpoint: entity.endpoint as any,
            p256dh: entity.p256dh as any,
            auth: entity.auth as any,
        };
    }
}
