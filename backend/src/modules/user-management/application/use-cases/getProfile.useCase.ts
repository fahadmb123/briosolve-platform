import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { User } from "../../domain/entities/user.entity.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRespository.js";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { GetProfileUseCaseOutputDto, GetProfileUseCaseInputDto } from "../Dto/userDto.js";

export default class GetProfileUseCase implements IUseCase<GetProfileUseCaseInputDto, GetProfileUseCaseOutputDto> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly customerRepository: ICustomerRepository,
        private readonly providerRepository: IProviderRepository
    ) {}

    async execute(input: GetProfileUseCaseInputDto): Promise<GetProfileUseCaseOutputDto> {
        const user = await this.userRepository.findById(input.id);

        if (!user) throw new ApplicationError("USER_NOT_FOUND", "User not found", "NOT_FOUND");

        let profile = null;

        if (input.role === "CUSTOMER") {
            profile = await this.customerRepository.findById(user.id);
        } else if (input.role === "PROVIDER") {
            profile = await this.providerRepository.findById(user.id);
        }

        return { user, profile };
    }
}