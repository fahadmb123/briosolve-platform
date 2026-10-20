import { IRefreshTokenService } from "../../../../../shared/application/interfaces/services/IRefreshToken.service";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IRefreshSessionRepository } from "../../../domain/repositories/refreshSession.repository";
import { LogoutInputDto } from "../../dtos/request/logout.dto";


export default class LogoutUseCase implements IUseCase<LogoutInputDto, void> {
    constructor(
        private readonly refreshSessionRepository: IRefreshSessionRepository,
        private readonly refreshTokenService: IRefreshTokenService
    ) {}

    async execute(input: LogoutInputDto): Promise<void> {
        if (!input.refreshToken) {
            return;
        }

        const tokenHash = this.refreshTokenService.hashToken(input.refreshToken);
        await this.refreshSessionRepository.revokeByTokenHash(tokenHash);
    }
}
