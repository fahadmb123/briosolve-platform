import { Request, Response, NextFunction } from "express";
import { redisClient } from "../database/redis.client";
import { CommonResponse } from "../models/common-response.model";

interface RateLimiterOptions {
    windowSeconds: number;
    maxRequests: number;
    prefix?: string;
}

export function rateLimiter(options: RateLimiterOptions) {
    const { windowSeconds, maxRequests, prefix = "rl" } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip || "unknown";
            const clientIp = Array.isArray(rawIp) ? rawIp[0] : String(rawIp).split(",")[0].trim();
            const identifier = req.user?.userId || clientIp;
            const key = `ratelimit:${prefix}:${identifier}`;

            const requestsCount = await redisClient.incr(key);

            if (requestsCount === 1) {
                await redisClient.expire(key, windowSeconds);
            }

            if (requestsCount > maxRequests) {
                const ttl = await redisClient.ttl(key);
                res.setHeader("Retry-After", String(Math.max(1, ttl)));

                const response = CommonResponse.error(
                    `Too many requests. Please try again in ${Math.max(1, ttl)} seconds.`,
                    ["RATE_LIMIT_EXCEEDED"]
                );

                return res.status(429).json(response.toJSON());
            }

            return next();
        } catch {
            return next();
        }
    };
}

