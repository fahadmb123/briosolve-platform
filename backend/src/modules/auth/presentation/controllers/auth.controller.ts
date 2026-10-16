import { NextFunction, Response, Request } from "express";
import { LoginInputDto, LoginOutputDto, RefreshTokenInputDto, RefreshTokenOutputDto, LogoutInputDto } from "../../application/dto/authDto";
import { User } from "../../domain/entities/user.entity";
import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import { IUserTokenPayload } from "../../../../shared/domain/interfaces/IToken";
import { EmailVerificationUseCaseInputDto, EmailVerificationUseCaseOutputDto, UpdateEmailUseCaseInputDto, UpdateEmailUseCaseOutputDto } from "../../application/dto/customerDto";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase";
import { sendSuccess } from "../../../../shared/presentation/http/response/response";
import { accessTokenCookie, refreshTokenCookie, clearAccessTokenCookieOptions, clearRefreshTokenCookieOptions, registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig";
import { UserResponseMapper } from "../mappers/userResponse.mapper";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";

export class AuthController extends BaseController {
    constructor(
        private readonly loginUseCase: IUseCase<LoginInputDto, LoginOutputDto>,
        private readonly getMeUseCase: IUseCase<IUserTokenPayload, User>,
        private readonly emailVerification: IUseCase<EmailVerificationUseCaseInputDto, EmailVerificationUseCaseOutputDto>,
        private readonly updateEmailUseCase: IUseCase<UpdateEmailUseCaseInputDto, UpdateEmailUseCaseOutputDto>,
        private readonly refreshTokenUseCase: IUseCase<RefreshTokenInputDto, RefreshTokenOutputDto>,
        private readonly logoutUseCase: IUseCase<LogoutInputDto, void>
    ) {
        super();
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.loginUseCase.execute({
                email: req.body.email,
                password: req.body.password,
                userAgent: req.headers["user-agent"] || null,
                ipAddress: req.ip || null
            });

            res.cookie("access_token", response.accessToken, accessTokenCookie);
            res.cookie("refresh_token", response.refreshToken, refreshTokenCookie);

            return sendSuccess(res, "LoggedIn Successfully", {
                accessToken: response.accessToken,
                user: UserResponseMapper.toDto(response.isExist)
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

            const response = await this.refreshTokenUseCase.execute({
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
                await this.logoutUseCase.execute({ refreshToken });
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
            const user = this.getCurrentUser(req);
            const response = await this.getMeUseCase.execute(user);

            return sendSuccess(res, "", UserResponseMapper.toDto(response));
        } catch (err) {
            next(err);
        }
    };

    emailVerify = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const work = req.query.work || "";
            let response = null;

            if (work === "UPDATE") {
                const user = this.getCurrentUser(req);
                response = await this.updateEmailUseCase.execute({ email: req.body.email, userId: user.userId });
            } else {
                response = await this.emailVerification.execute({ email: req.body.email });
            }

            res.cookie("registration_id", response.registrationId, registrationCookie);

            return sendSuccess(res, "OTP Sent Successfully", { expiresIn: response.expiresIn });
        } catch (err) {
            next(err);
        }
    };
}