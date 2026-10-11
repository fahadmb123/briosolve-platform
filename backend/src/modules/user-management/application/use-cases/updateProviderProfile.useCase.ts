import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository.js";
import { UpdateProviderProfileInputDto } from "../Dto/providerDto.js";

export default class UpdateProviderProfileUseCase implements IUseCase<UpdateProviderProfileInputDto, void> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly providerRepository: IProviderRepository
    ) {}

    async execute(input: UpdateProviderProfileInputDto): Promise<void> {
        const user = await this.userRepository.findById(input.id);
        if (!user) throw new ApplicationError("USER_NOT_FOUND", "User not found", "NOT_FOUND");

        await this.providerRepository.updateProfile({ id: input.id, data: input.data });
    }
}
