import { Request, Response, NextFunction } from "express";
import AppError from "../../../shared/error/app-error";

export const errorHandler = (error: unknown,req: Request,res: Response,next: NextFunction): void => {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            code: error.code,
            message: error.message,
        });

        return
    }

    res.status(500).json({
        success: false,
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
    });
};