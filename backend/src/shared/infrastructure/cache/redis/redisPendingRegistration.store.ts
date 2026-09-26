import {IPendingCustomerRegistration,IPendingRegistrationStore,} from "../../../domain/interfaces/IPendingRegistration-store.js";
import { redisClient } from "./redis.client.js";



export class RedisPendingRegistrationStore implements IPendingRegistrationStore {

    async save(registrationId: string,data: IPendingCustomerRegistration,ttlSeconds: number): Promise<void> {
      
        const key = `pending-registration:${registrationId}`
        await redisClient.set(key, JSON.stringify(data),{EX: ttlSeconds})

    }

    async get(registrationId: string): Promise<IPendingCustomerRegistration | null> {
        const key = `pending-registration:${registrationId}`
        const data = await redisClient.get(key)

        if (!data) return null
        return JSON.parse(data) as IPendingCustomerRegistration;
    }

    async delete(registrationId: string): Promise<void> {
        const key = `pending-registration:${registrationId}`
        await redisClient.del(key)
    }
    async getTtl(registrationId: string): Promise<number> {
        const key = `pending-registration:${registrationId}`;

        return await redisClient.ttl(key);
    }
}