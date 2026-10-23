import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { ICustomerRepository } from "../../../domain/repositories/ICustomerRespository";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetProfileUseCaseInputDto } from "../../dtos/request/user/get-profile.dto";
import { GetProfileUseCaseOutputDto } from "../../dtos/response/user/get-profile.dto";


export default class GetProfileUseCase implements IUseCase<GetProfileUseCaseInputDto, GetProfileUseCaseOutputDto> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _customerRepository: ICustomerRepository,
        private readonly _providerRepository: IProviderRepository
    ) {}

    async execute(input: GetProfileUseCaseInputDto): Promise<GetProfileUseCaseOutputDto> {
        const user = await this._userRepository.findById(input.id);

        if (!user) throw new ApplicationError("USER_NOT_FOUND", "User not found", "NOT_FOUND");

        let profile = null;

        if (input.role === "CUSTOMER") {
            profile = await this._customerRepository.findById(user.id);
        } else if (input.role === "PROVIDER") {
            profile = await this._providerRepository.findById(user.id);
        }

        return { user, profile };
    }
}