import crypto from "crypto";
import { IJwtService } from "../../../../../shared/application/Dto/services/jwtDto.service";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { envConfig } from "../../../../../shared/infrastructure/config/env.config";
import { IRefreshTokenService } from "../../../../../shared/application/interfaces/services/IRefreshToken.service";
import { RefreshSession } from "../../../domain/entities/refreshSession.entity";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IRefreshSessionRepository } from "../../../domain/repositories/refreshSession.repository";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { RefreshTokenOutputDto } from "../../dtos/response/refresh-token.dto";
import { RefreshTokenInputDto } from "../../dtos/request/refresh-token.dto";


export default class RefreshTokenUseCase implements IUseCase<RefreshTokenInputDto, RefreshTokenOutputDto> {
    constructor(
        private readonly refreshSessionRepository: IRefreshSessionRepository,
        private readonly userRepository: IUserRepository,
        private readonly jwtService: IJwtService,
        private readonly refreshTokenService: IRefreshTokenService
    ) {}

    async execute(input: RefreshTokenInputDto): Promise<RefreshTokenOutputDto> {
        if (!input.refreshToken) {
            throw new ApplicationError("TOKEN_REQUIRED", "Refresh token is required", "AUTHENTICATION");
        }

        const tokenHash = this.refreshTokenService.hashToken(input.refreshToken);
        const session = await this.refreshSessionRepository.findByTokenHash(tokenHash);

        if (!session) {
            throw new ApplicationError("INVALID_TOKEN", "Invalid refresh token", "AUTHENTICATION");
        }

        if (session.isRevoked()) {
            const timeSinceRevocationMs = session.revokedAt ? (Date.now() - session.revokedAt.getTime()) : Infinity;
            if (timeSinceRevocationMs > envConfig.REFRESH_TOKEN_ROTATION_GRACE_PERIOD_MS) {
                await this.refreshSessionRepository.revokeAllByFamilyId(session.familyId);
                throw new ApplicationError("TOKEN_REUSED", "Invalid session state detected. All sessions terminated.", "AUTHENTICATION");
            }
            throw new ApplicationError("TOKEN_ROTATED", "Refresh token was recently rotated", "AUTHENTICATION");
        }

        if (session.isExpired()) {
            throw new ApplicationError("TOKEN_EXPIRED", "Refresh token has expired", "AUTHENTICATION");
        }

        const user = await this.userRepository.findById(session.userId);
        if (!user) {
            throw new ApplicationError("USER_NOT_FOUND", "User not found", "NOT_FOUND");
        }

        if (user.status === "INACTIVE") {
            throw new ApplicationError("INACTIVE_ACCOUNT", "Inactive Account", "AUTHORIZATION");
        }
        if (user.status === "BLOCKED") {
            throw new ApplicationError("BLOCKED_ACCOUNT", "Your account has been blocked", "AUTHORIZATION");
        }

        const newRawRefreshToken = this.refreshTokenService.generateToken();
        const newTokenHash = this.refreshTokenService.hashToken(newRawRefreshToken);
        const expiresAt = new Date(Date.now() + envConfig.REFRESH_TOKEN_COOKIE_MAX_AGE_MS);
        const now = new Date();

        const newSession = new RefreshSession(
            crypto.randomUUID(),
            user.id,
            newTokenHash,
            session.familyId,
            expiresAt,
            null,
            input.userAgent ?? session.userAgent,
            input.ipAddress ?? session.ipAddress,
            now,
            now
        );

        const rotated = await this.refreshSessionRepository.rotateSession(tokenHash, newSession);
        if (!rotated) {
            const currentSession = await this.refreshSessionRepository.findByTokenHash(tokenHash);
            const timeSinceRevocationMs = currentSession?.revokedAt ? (Date.now() - currentSession.revokedAt.getTime()) : Infinity;
            if (timeSinceRevocationMs > envConfig.REFRESH_TOKEN_ROTATION_GRACE_PERIOD_MS) {
                await this.refreshSessionRepository.revokeAllByFamilyId(session.familyId);
                throw new ApplicationError("TOKEN_REUSED", "Concurrent session conflict detected. All sessions terminated.", "AUTHENTICATION");
            }
            throw new ApplicationError("TOKEN_ROTATED", "Concurrent refresh conflict. Token already rotated.", "AUTHENTICATION");
        }

        const accessToken = this.jwtService.generate({
            userId: user.id,
            role: user.role
        });

        return {
            accessToken,
            refreshToken: newRawRefreshToken
        };
    }
}
