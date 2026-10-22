import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default("5000"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    DIRECT_URL: z.string().optional(),
    REDIS_URL: z.string().optional(),
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    JWT_ACCESS_SECRET: z.string().optional(),
    JWT_REFRESH_SECRET: z.string().optional(),
    ACCESS_TOKEN_EXPIRATION: z.string().default("15m"),
    REFRESH_TOKEN_EXPIRATION: z.string().default("7d"),
    ACCESS_TOKEN_COOKIE_MAX_AGE_MS: z.coerce.number().default(15 * 60 * 1000),
    REFRESH_TOKEN_COOKIE_MAX_AGE_MS: z.coerce.number().default(7 * 24 * 60 * 60 * 1000),
    REGISTRATION_COOKIE_MAX_AGE_MS: z.coerce.number().default(10 * 60 * 1000),
    CORS_ORIGIN: z.string().default("http://localhost:5173")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Environment configuration validation failed:", parsedEnv.error.format());
    throw new Error("Invalid application environment configuration");
}

const rawConfig = parsedEnv.data;

export const envConfig = {
    ...rawConfig,
    JWT_ACCESS_SECRET: rawConfig.JWT_ACCESS_SECRET || rawConfig.JWT_SECRET,
    JWT_REFRESH_SECRET: rawConfig.JWT_REFRESH_SECRET || rawConfig.JWT_SECRET,
    isProduction: rawConfig.NODE_ENV === "production"
};

export type EnvConfig = typeof envConfig;
