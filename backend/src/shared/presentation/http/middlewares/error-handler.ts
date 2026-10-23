import { Request, Response, NextFunction } from "express";
import { HttpErrorMapper } from "../errors/http-error.mapper";
import { logger } from "../../../infrastructure/logger/logger";

export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction): void => {
    const httpError = HttpErrorMapper.map(error);

    if (httpError.statusCode >= 500) {
        logger.error({ err: error, method: req.method, url: req.url, statusCode: httpError.statusCode, code: httpError.code }, "Unhandled application error");
    } else {
        logger.warn({ method: req.method, url: req.url, statusCode: httpError.statusCode, code: httpError.code }, "Client error");
    }

    res.status(httpError.statusCode).json({
        success: false,
        code: httpError.code,
        message: httpError.message,
    });
};
