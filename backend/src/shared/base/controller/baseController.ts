import type { Response } from "express";

export abstract class BaseController {
    protected sendSuccess<T>(res: Response, message: string, data: T | null = null, statusCode: number = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }
}