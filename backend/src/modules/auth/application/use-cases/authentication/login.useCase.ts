import crypto from "crypto";
import { IJwtService } from "../../../../../shared/application/Dto/services/jwtDto.service";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { envConfig } from "../../../../../shared/infrastructure/config/env.config";
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service";
import { IRefreshTokenService } from "../../../../../shared/application/interfaces/services/IRefreshToken.service";
import { RefreshSession } from "../../../domain/entities/refreshSession.entity";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IRefreshSessionRepository } from "../../../domain/repositories/refreshSession.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { LoginOutputDto } from "../../dtos/response/login.dto";
import { LoginInputDto } from "../../dtos/request/login.dto";


export default class LoginUseCase implements IUseCase<LoginInputDto, LoginOutputDto> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly passwordHasher: IPasswordHasher,
        private readonly jwtService: IJwtService,
        private readonly refreshSessionRepository: IRefreshSessionRepository,
        private readonly refreshTokenService: IRefreshTokenService
    ) {}

    async execute(input: LoginInputDto): Promise<LoginOutputDto> {
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new ApplicationError("USER_NOT_FOUND", "User not found", "NOT_FOUND");
        }

        const isPasswordValid = await this.passwordHasher.compare(input.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new ApplicationError("INVALID_PASSWORD", "Invalid Password", "AUTHORIZATION");
        }

        if (user.status === "INACTIVE") {
            throw new ApplicationError("INACTIVE_ACCOUNT", "Inactive Account", "AUTHORIZATION");
        }
        if (user.status === "BLOCKED") {
            throw new ApplicationError("BLOCKED_ACCOUNT", "Your account has been blocked", "AUTHORIZATION");
        }

        const accessToken = this.jwtService.generate({
            userId: user.id,
            role: user.role
        });

        const rawRefreshToken = this.refreshTokenService.generateToken();
        const tokenHash = this.refreshTokenService.hashToken(rawRefreshToken);
        const familyId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + envConfig.REFRESH_TOKEN_COOKIE_MAX_AGE_MS);
        const now = new Date();

        const session = new RefreshSession(
            crypto.randomUUID(),
            user.id,
            tokenHash,
            familyId,
            expiresAt,
            null,
            input.userAgent ?? null,
            input.ipAddress ?? null,
            now,
            now
        );

        await this.refreshSessionRepository.create(session);

        return {
            accessToken,
            refreshToken: rawRefreshToken,
            isExist: user
        };
    }
}