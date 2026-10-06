import { IJwtService } from "../../../../../shared/application/Dto/services/jwtDto.service.js"
import { ApplicationError } from "../../../../../shared/application/errors/applicationError.js"
import { IUserTokenPayload } from "../../../../../shared/domain/interfaces/IToken.js"
import { User } from "../../../domain/entities/user.entity.js"
import { IUseCase } from "../../../domain/interfaces/use-cases/IUseCase.js"
import { IUserRepository } from "../../../domain/repositories/user.repository.js"




export default class GetMeUseCase implements IUseCase<IUserTokenPayload,User>{
    constructor(
        private readonly userRepository:IUserRepository
    ){}

    async execute (user:IUserTokenPayload):Promise<User>{
        const foundUser = await this.userRepository.findById(user.userId)
        if (!foundUser) throw new ApplicationError("USER_NOT_FOUND","User not found","NOT_FOUND")
        return foundUser;
    }
}