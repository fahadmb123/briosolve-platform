import { createClient } from "redis";
import { logger } from "../../logger/logger";

export const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
    logger.error({ err: error }, "Redis client error");
});

export const connectRedis = async (): Promise<void> => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};