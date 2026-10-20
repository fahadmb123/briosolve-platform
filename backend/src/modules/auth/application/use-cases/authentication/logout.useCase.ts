import { IRefreshTokenService } from "../../../../../shared/domain/interfaces/services/IRefreshToken.service";
import { IUseCase } from "../../../../../shared/domain/interfaces/use-cases/IUseCase";
import { IRefreshSessionRepository } from "../../../domain/repositories/refreshSession.repository";
import { LogoutInputDto } from "../../dto/request/logout.dto";


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
