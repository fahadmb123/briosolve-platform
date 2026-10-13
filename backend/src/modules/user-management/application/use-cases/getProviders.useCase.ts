import { User } from "../../domain/entities/user.entity.js";
import { IGetProvidersUseCase } from "../../domain/interfaces/use-cases/IGetProvidersUseCase.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { getProvidersDto } from "../Dto/getProvidersDto.js";

export default class GetProvidersUseCase implements IGetProvidersUseCase {
    constructor(
        private readonly userRepository: IUserRepository
    ) {}

    async execute(input: getProvidersDto): Promise<{ users: User[]; total: number; totalPages: number }> {
        const response = await this.userRepository.getUsersWithRole({
            role: "PROVIDER",
            ...input
        });

        const totalPages = Math.ceil(response.total / input.limit);
        return {
            users: response.users,
            total: response.total,
            totalPages
        };
    }
}
