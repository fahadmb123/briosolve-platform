import { Request, Response, NextFunction } from "express";
import { JwtService } from "../../../infrastructure/security/jwt.service";
import { checkAccountStatus } from "../utils/check-account-status";
import { HttpStatus, AuthErrorCode, AuthErrorMessage, AuthCookieNames } from "../constants/auth.constants";
import { clearAccessTokenCookieOptions, clearRefreshTokenCookieOptions } from "../cookies/cookieConfig";

const jwtService = new JwtService();

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void | Response> => {
    try {
        const token = req.cookies?.[AuthCookieNames.ACCESS_TOKEN];

        if (!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                code: AuthErrorCode.AUTHENTICATION_REQUIRED,
                message: AuthErrorMessage.AUTHENTICATION_REQUIRED,
            });
        }

        let payload;
        try {
            payload = jwtService.verify(token);
        } catch {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                code: AuthErrorCode.INVALID_TOKEN,
                message: AuthErrorMessage.INVALID_OR_EXPIRED_TOKEN,
            });
        }

        const statusCheck = await checkAccountStatus(payload.userId);

        if (!statusCheck.isAllowed || !statusCheck.user) {
            res.clearCookie(AuthCookieNames.ACCESS_TOKEN, clearAccessTokenCookieOptions);
            res.clearCookie(AuthCookieNames.REFRESH_TOKEN, clearRefreshTokenCookieOptions);

            return res.status(statusCheck.statusCode ?? HttpStatus.FORBIDDEN).json({
                success: false,
                code: statusCheck.code,
                message: statusCheck.message,
            });
        }

        req.user = {
            userId: statusCheck.user.id,
            role: statusCheck.user.role,
        };

        return next();
    } catch (error) {
        return next(error);
    }
};
