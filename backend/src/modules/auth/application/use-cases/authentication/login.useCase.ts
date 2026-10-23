import { IJwtService } from "../../../../../shared/application/Dto/services/jwtDto.service";
import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IPasswordHasher } from "../../../../../shared/application/interfaces/services/IPasswordHasher.service";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { LoginOutputDto } from "../../dtos/response/login.dto";
import { LoginInputDto } from "../../dtos/request/login.dto";

export default class LoginUseCase implements IUseCase<LoginInputDto, LoginOutputDto> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _passwordHasher: IPasswordHasher,
        private readonly _jwtService: IJwtService
    ) {}

    async execute(input: LoginInputDto): Promise<LoginOutputDto> {
        const user = await this._userRepository.findByEmail(input.email);
        if (!user) {
            throw new ApplicationError("USER_NOT_FOUND", "User not found", "NOT_FOUND");
        }

        const isPasswordValid = await this._passwordHasher.compare(input.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new ApplicationError("INVALID_PASSWORD", "Invalid Password", "AUTHORIZATION");
        }

        if (user.status === "INACTIVE") {
            throw new ApplicationError("INACTIVE_ACCOUNT", "Inactive Account", "AUTHORIZATION");
        }
        if (user.status === "BLOCKED") {
            throw new ApplicationError("BLOCKED_ACCOUNT", "Your account has been blocked", "AUTHORIZATION");
        }

        const accessToken = this._jwtService.generate({
            userId: user.id,
            role: user.role
        });

        const refreshToken = this._jwtService.generateRefreshToken({
            userId: user.id,
            role: user.role
        });

        return {
            accessToken,
            refreshToken,
            isExist: user
        };
    }
}