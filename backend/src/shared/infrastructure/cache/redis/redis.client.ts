import { createClient } from "redis";
import { logger } from "../../logger/logger";

let lastErrorLogTime = 0;
const ERROR_LOG_INTERVAL_MS = 30000; // Throttle error logs to at most once every 30 seconds
let isConnected = false;

export const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
        reconnectStrategy: (retries) => {
            return Math.min(retries * 1000, 10000);
        }
    }
});

redisClient.on("connect", () => {
    isConnected = true;
    logger.info("Redis connected");
});

redisClient.on("ready", () => {
    isConnected = true;
});

redisClient.on("end", () => {
    isConnected = false;
});

redisClient.on("error", (error) => {
    const now = Date.now();
    if (isConnected) {
        isConnected = false;
        logger.error({ err: error }, "Redis connection lost");
        lastErrorLogTime = now;
        return;
    }

    if (now - lastErrorLogTime > ERROR_LOG_INTERVAL_MS) {
        lastErrorLogTime = now;
        logger.warn(
            { err: error },
            "Redis client connection failed (retrying in background; repeating logs suppressed for 30s)"
        );
    }
});

export const connectRedis = async (timeoutMs = 5000): Promise<void> => {
    if (!redisClient.isOpen) {
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(
                () => reject(new Error(`Redis connection timed out after ${timeoutMs}ms. Please ensure Redis is running at ${process.env.REDIS_URL || "redis://localhost:6379"}`)),
                timeoutMs
            )
        );
        await Promise.race([redisClient.connect(), timeoutPromise]);
    }
};