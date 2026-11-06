import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateFile = (schema: ZodSchema) => 
    (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            errors: { file: ["No file uploaded"] },
        });
    }

    const result = schema.safeParse(req.file);
    
    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error.flatten().fieldErrors,
        });
    }
    next();
  };
