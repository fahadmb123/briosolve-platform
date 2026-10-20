import { User } from "../../domain/entities/user.entity";
import { IGetProvidersUseCase } from "../interfaces/use-cases/providers/get-providers.interface";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { getProvidersDto } from "../Dto/getProvidersDto";

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
