import { ApplicationError } from "../../../../shared/application/errors/applicationError.js"
import { User } from "../../domain/entities/user.entity.js"
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js"
import { ICustomerRepository } from "../../domain/repositories/ICustomerRespository.js"
import { IUserRepository } from "../../domain/repositories/IUserRepository.js"
import { GetProfileUseCaseOutputDto, GetProfileUseCaseInputDto } from "../Dto/userDto.js"







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
            userFound.current_address_id,
            userFound.created_at,
            userFound.updated_at
        )

        let profile = null

        if (input.role === "CUSTOMER") {
            profile = await  this.customerRepository.findById(user.id)
        }

        return  {user,profile}
    }
}