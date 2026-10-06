import { Request, Response, NextFunction } from "express";

export const requireRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have permission to access this resource"
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error during role verification"
            });
        }
    };
};
