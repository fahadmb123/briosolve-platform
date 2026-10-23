import pino from "pino";
import { envConfig } from "../config/env.config";

export const logger = pino({
    level: envConfig.LOG_LEVEL,
    redact: {
        paths: [
            "req.headers.authorization",
            "req.headers.cookie",
            'req.headers["set-cookie"]',
            'res.headers["set-cookie"]',
            "password",
            "*.password",
            "confirmPassword",
            "*.confirmPassword",
            "currentPassword",
            "*.currentPassword",
            "newPassword",
            "*.newPassword",
            "token",
            "*.token",
            "accessToken",
            "*.accessToken",
            "refreshToken",
            "*.refreshToken",
            "otp",
            "*.otp",
            "secret",
            "*.secret",
            "aadhaar",
            "*.aadhaar",
            "aadhaar_number",
            "*.aadhaar_number",
            "document_number",
            "*.document_number"
        ],
        censor: "[REDACTED]"
    }
});

export type Logger = typeof logger;
