import pino from "pino";
import path from "path"
import { envConfig } from "../config/env.config";


const transport = pino.transport({
    targets: [
        {
            target: "pino-roll",
            options: {
                file: path.join(process.cwd(), "logs", "app"),
                frequency: "daily",
                mkdir: true,
                extension: ".log"
            },
            level: envConfig.LOG_LEVEL
        },
        {
            target: "pino/file",
            options: {
                destination: 1
            },
            level: envConfig.LOG_LEVEL
        }
    ]
})

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
    
},transport)

export type Logger = typeof logger;
