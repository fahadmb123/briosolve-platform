import { pinoHttp } from "pino-http";
import { randomUUID } from "crypto";
import { logger } from "../../../infrastructure/logger/logger";

export const requestLogger = pinoHttp({
    logger,
    genReqId: (req, res) => {
        const existingId = req.headers["x-request-id"];
        if (existingId && typeof existingId === "string") {
            res.setHeader("x-request-id", existingId);
            return existingId;
        }
        const id = randomUUID();
        res.setHeader("x-request-id", id);
        return id;
    },
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params
        }),
        res: (res) => ({
            statusCode: res.statusCode
        })
    },
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err) {
            return "error";
        }
        if (res.statusCode >= 400) {
            return "warn";
        }
        return "info";
    },
    customSuccessMessage: (req, res) => {
        return `${req.method} ${req.url} completed ${res.statusCode}`;
    },
    customErrorMessage: (req, res) => {
        return `${req.method} ${req.url} failed ${res.statusCode}`;
    }
});
