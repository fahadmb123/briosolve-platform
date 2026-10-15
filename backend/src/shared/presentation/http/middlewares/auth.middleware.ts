import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../../infrastructure/security/jwt.service";

const jwtService = new JwtService();

export const authMiddleware = (req: Request,res: Response,next: NextFunction) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const payload = jwtService.verify(token);

        req.user = {userId: payload.userId, role: payload.role}

        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};