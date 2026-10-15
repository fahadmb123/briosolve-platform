import { Request, Response, NextFunction } from "express";
import { HttpErrorMapper } from "../errors/http-error.mapper";

export const errorHandler = (error: unknown,req: Request,res: Response,next: NextFunction): void => {
    const httpError = HttpErrorMapper.map(error)
    res.status(httpError.statusCode).json({
        success: false,
        code: httpError.code,
        message: httpError.message,
    })
}