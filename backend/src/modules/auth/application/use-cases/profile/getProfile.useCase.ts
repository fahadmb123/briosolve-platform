import { ApplicationError } from "../../../../../shared/application/errors/applicationError.js"
import { CustomerProfile } from "../../../domain/entities/customerProfile.entity.js"
import { User } from "../../../domain/entities/user.entity.js"
import { IUseCase } from "../../../domain/interfaces/use-cases/IUseCase.js"
import { ICustomerRepository } from "../../../domain/repositories/customer.respository.js"
import { IUserRepository } from "../../../domain/repositories/user.repository.js"
import { GetProfileUseCaseOutputDto, GetProfileUseCaseInputDto } from "../../dto/authDto.js"







export default class GetProfileUseCase implements IUseCase<GetProfileUseCaseInputDto,GetProfileUseCaseOutputDto>{
    constructor(
        private readonly userRepository:IUserRepository,
        private readonly customerRepository:ICustomerRepository
    ){}

    async execute (input:GetProfileUseCaseInputDto):Promise<GetProfileUseCaseOutputDto>{
        const userFound = await this.userRepository.findById(input.id)

        if (!userFound) throw new ApplicationError("USER_NOT_FOUND","User not found","NOT_FOUND")

        const user = new User(
            userFound.id,
            userFound.name,
            userFound.email,
            userFound.phone,
            userFound.role,
            userFound.status,
            userFound.email_verified,
            userFound.phone_verified,
            new Date(userFound.created_at.epochMilliseconds),
            new Date(userFound.updated_at.epochMilliseconds)
        )

        let profile = null

        if (input.role === "CUSTOMER") {
            profile = await  this.customerRepository.findById(user.id)
        }

        return  {user,profile}
    }
}