import { IJwtService } from "../../../../shared/application/Dto/services/jwtDto.service.js"
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js"
import { IUserTokenPayload } from "../../../../shared/domain/interfaces/IToken.js"
import { Customer } from "../../domain/entities/customer.entity.js"
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js"
import { ICustomerRepository } from "../../domain/repositories/customer.repository.js"




export default class GetMeUseCase implements IUseCase<IUserTokenPayload,Customer>{
    constructor(
        private readonly userRepository:ICustomerRepository
    ){}

    async execute (user:IUserTokenPayload):Promise<Customer>{
        const foundUser = await this.userRepository.findById(user.userId)
        if (!foundUser) throw new ApplicationError("USER_NOT_FOUND","User not found","NOT_FOUND")
        return foundUser
    }
}