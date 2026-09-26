import {IPendingCustomerRegistration,IPendingRegistrationStore,} from "../../../application/interfaces/services/pending-registration-store.js";
import { redisClient } from "./redis.client.js";



export class RedisPendingRegistrationStoreImpl implements IPendingRegistrationStore {

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
}