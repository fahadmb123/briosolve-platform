import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { PushSubscription } from "../entities/pushSubscription.entity";

export interface IPushSubscriptionRepository extends BaseRepository<PushSubscription | null> {
    saveSubscription(data: Omit<PushSubscription, "id" | "createdAt">): Promise<void>;
    findByUserId(userId: string): Promise<PushSubscription[]>;
    findByEndpoint(endpoint: string): Promise<PushSubscription | null>;
    deleteByEndpoint(endpoint: string): Promise<void>;
}
