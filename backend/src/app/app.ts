import express from "express";
import path from "node:path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { envConfig } from "../shared/infrastructure/config/env.config";
import { requestLogger } from "../shared/presentation/http/middlewares/request-logger";
import helmet from "helmet";

export function createApp() {
    const app = express();

    app.use(helmet());

    app.use(cors({
        origin: envConfig.CORS_ORIGIN,
        credentials: true,
    }));

    app.use(requestLogger);
    app.use(express.json());
    app.use(cookieParser());

    app.use(
        "/uploads",
        express.static(path.join(process.cwd(), "public", "uploads")),
    );

    return app;
}