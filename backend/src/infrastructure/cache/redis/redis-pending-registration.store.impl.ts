import {PendingCustomerRegistration,PendingRegistrationStore,} from "../../../application/interfaces/services/pending-registration-store.js";
import { redisClient } from "./redis.client.js";



export class RedisPendingRegistrationStoreImpl implements PendingRegistrationStore {

    async save(registrationId: string,data: PendingCustomerRegistration,ttlSeconds: number): Promise<void> {
      
        const key = `pending-registration:${registrationId}`
        await redisClient.set(key, JSON.stringify(data),{EX: ttlSeconds})
        //console.log("Here We Go")
    }

    async get(registrationId: string): Promise<PendingCustomerRegistration | null> {
        const key = `pending-registration:${registrationId}`
        const data = await redisClient.get(key)

        if (!data) return null
        return JSON.parse(data) as PendingCustomerRegistration;
    }

    async delete(registrationId: string): Promise<void> {
        const key = `pending-registration:${registrationId}`
        await redisClient.del(key)
    }
}