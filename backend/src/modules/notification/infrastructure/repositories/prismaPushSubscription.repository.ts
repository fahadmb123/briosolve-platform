import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { PushSubscription } from "../../domain/entities/pushSubscription.entity";
import { IPushSubscriptionRepository } from "../../domain/repositories/IPushSubscription.respository";
import { PushSubscriptionMapper } from "../mappers/pushSubscription.mapper";

export class PrismaPushSubscriptionRepository implements IPushSubscriptionRepository {
    async findById(id: string): Promise<PushSubscription | null> {
        const record = await db.orm.public.push_subscriptions
            .where({ id: id })
            .first();

        if (!record) return null;

        return PushSubscriptionMapper.toDomain(record);
    }

    async findByEndpoint(endpoint: string): Promise<PushSubscription | null> {
        const record = await db.orm.public.push_subscriptions
            .where({ endpoint: endpoint as any })
            .first();

        if (!record) return null;

        return PushSubscriptionMapper.toDomain(record);
    }

    async saveSubscription(data: Omit<PushSubscription, "id" | "createdAt">): Promise<void> {
        const existing = await db.orm.public.push_subscriptions
            .where({ endpoint: data.endpoint as any })
            .first();

        if (existing) {
            await db.orm.public.push_subscriptions
                .where({ endpoint: data.endpoint as any })
                .update({
                    user_id: data.userId,
                    p256dh: data.p256dh as any,
                    auth: data.auth as any,
                });
            return;
        }

        await db.orm.public.push_subscriptions.create(
            PushSubscriptionMapper.toPersistence(data)
        );
    }

    async findByUserId(userId: string): Promise<PushSubscription[]> {
        const records = await db.orm.public.push_subscriptions
            .where({ user_id: userId })
            .all();

        return records.map((record) => PushSubscriptionMapper.toDomain(record));
    }

    async deleteByEndpoint(endpoint: string): Promise<void> {
        try {
            await db.orm.public.push_subscriptions
                .where({ endpoint: endpoint as any })
                .deleteAll();
        } catch {
        }
    }
}
