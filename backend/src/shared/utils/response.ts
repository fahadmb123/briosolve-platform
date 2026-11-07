import { Response } from "express";
import { CommonResponse } from "../models/common-response.model";

export const sendSuccess = <T>(
    res: Response,
    message: string,
    data: T | null = null,
    statusCode = 200,
    meta: Record<string, unknown> | null = null
) => {
    const response = CommonResponse.success(message, data, meta);
    return res.status(statusCode).json(response.toJSON());
};

export const sendError = (
    res: Response,
    message: string,
    statusCode = 500,
    errors: unknown[] | null = null
) => {
    const response = CommonResponse.error(message, errors);
    return res.status(statusCode).json(response.toJSON());
};
