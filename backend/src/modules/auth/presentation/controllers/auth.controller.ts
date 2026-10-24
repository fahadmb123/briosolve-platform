import { NextFunction, Response, Request } from "express";
import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import { IUserTokenPayload } from "../../../../shared/application/interfaces/IToken";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { sendSuccess } from "../../../../shared/presentation/http/response/response";
import { accessTokenCookie, refreshTokenCookie, clearAccessTokenCookieOptions, clearRefreshTokenCookieOptions, registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig";
import { UserMapper } from "../../infrastructure/mappers/user.mapper";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { LoginOutputDto } from "../../application/dtos/response/login.dto";
import { LoginInputDto } from "../../application/dtos/request/login.dto";
import { EmailVerificationUseCaseInputDto } from "../../application/dtos/request/email-verification.dto";
import { EmailVerificationUseCaseOutputDto } from "../../application/dtos/response/email-verification.dto";
import { UpdateEmailUseCaseOutputDto } from "../../application/dtos/response/update-email.dto";
import { UpdateEmailUseCaseInputDto } from "../../application/dtos/request/update-email.dto";
import { RefreshTokenInputDto } from "../../application/dtos/request/refresh-token.dto";
import { RefreshTokenOutputDto } from "../../application/dtos/response/refresh-token.dto";
import { LogoutInputDto } from "../../application/dtos/request/logout.dto";
import { UserResponseDto } from "../../application/dtos/response/user.dto";

export class AuthController extends BaseController {
    constructor(
        private readonly _loginUseCase: IUseCase<LoginInputDto, LoginOutputDto>,
        private readonly _getMeUseCase: IUseCase<IUserTokenPayload, UserResponseDto>,
        private readonly _emailVerification: IUseCase<EmailVerificationUseCaseInputDto, EmailVerificationUseCaseOutputDto>,
        private readonly _updateEmailUseCase: IUseCase<UpdateEmailUseCaseInputDto, UpdateEmailUseCaseOutputDto>,
        private readonly _refreshTokenUseCase: IUseCase<RefreshTokenInputDto, RefreshTokenOutputDto>,
        private readonly _logoutUseCase: IUseCase<LogoutInputDto, void>
    ) {
        super();
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this._loginUseCase.execute({
                email: req.body.email,
                password: req.body.password,
                userAgent: req.headers["user-agent"] || null,
                ipAddress: req.ip || null
            });

            res.cookie("access_token", response.accessToken, accessTokenCookie);
            res.cookie("refresh_token", response.refreshToken, refreshTokenCookie);

            return sendSuccess(res, "Authenticated", {
                accessToken: response.accessToken,
                user: UserMapper.toDto(response.isExist)
            });
        } catch (err) {
            next(err);
        }
    };

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refresh_token;

            if (!refreshToken) {
                throw new ApplicationError("TOKEN_REQUIRED", "Refresh token is required", "AUTHENTICATION");
            }

            const response = await this._refreshTokenUseCase.execute({
                refreshToken,
                userAgent: req.headers["user-agent"] || null,
                ipAddress: req.ip || null
            });

            res.cookie("access_token", response.accessToken, accessTokenCookie);
            res.cookie("refresh_token", response.refreshToken, refreshTokenCookie);

            return sendSuccess(res, "Token refreshed successfully");
        } catch (err) {
            next(err);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refresh_token;

            if (refreshToken) {
                await this._logoutUseCase.execute({ refreshToken });
            }

            res.clearCookie("access_token", clearAccessTokenCookieOptions);
            res.clearCookie("refresh_token", clearRefreshTokenCookieOptions);

            return sendSuccess(res, "Logged Out");
        } catch (err) {
            res.clearCookie("access_token", clearAccessTokenCookieOptions);
            res.clearCookie("refresh_token", clearRefreshTokenCookieOptions);
            next(err);
        }
    };

    getMe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const response = await this._getMeUseCase.execute(user);

            return this.sendSuccess(res, "", response)
        } catch (err) {
            next(err);
        }
    };

    emailVerify = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const work = req.query.work || "";
            let response = null;

            if (work === "UPDATE") {
                const user = req.user!;
                response = await this._updateEmailUseCase.execute({ email: req.body.email, userId: user.userId });
            } else {
                response = await this._emailVerification.execute({ email: req.body.email });
            }

            res.cookie("registration_id", response.registrationId, registrationCookie);

            return this.sendSuccess(res, "OTP Sent Successfully", { expiresIn: response.expiresIn });
        } catch (err) {
            next(err);
        }
    };
}