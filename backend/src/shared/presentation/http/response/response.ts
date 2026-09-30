import { Response } from "express";

export const sendSuccess = <T>(res: Response,message: string,data: T | null = null,statusCode: number = 200) => {
    return res.status(statusCode).json({
        success:true,
        message,
        data
    })
}