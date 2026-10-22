import { IJwtService } from "../../../../../shared/application/Dto/services/jwtDto.service";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { RefreshTokenOutputDto } from "../../dtos/response/refresh-token.dto";
import { RefreshTokenInputDto } from "../../dtos/request/refresh-token.dto";

export default class RefreshTokenUseCase implements IUseCase<RefreshTokenInputDto, RefreshTokenOutputDto> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly jwtService: IJwtService
    ) {}

    async execute(input: RefreshTokenInputDto): Promise<RefreshTokenOutputDto> {
        if (!input.refreshToken) {
            throw new ApplicationError("TOKEN_REQUIRED", "Refresh token is required", "AUTHENTICATION");
        }

        let payload;
        try {
            payload = this.jwtService.verifyRefreshToken(input.refreshToken);
        } catch {
            throw new ApplicationError("INVALID_TOKEN", "Invalid or expired refresh token", "AUTHENTICATION");
        }

        const user = await this.userRepository.findById(payload.userId);
        if (!user) {
            throw new ApplicationError("USER_NOT_FOUND", "User not found", "NOT_FOUND");
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

        const newRefreshToken = this.jwtService.generateRefreshToken({
            userId: user.id,
            role: user.role
        });

        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    }
}
