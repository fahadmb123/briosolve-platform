import { IJwtService } from "../../../../../shared/application/Dto/services/jwtDto.service"
import { ApplicationError } from "../../../../../shared/application/errors/applicationError"
import { IUserTokenPayload } from "../../../../../shared/application/interfaces/IToken"
import { User } from "../../../domain/entities/user.entity"
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase"
import { IUserRepository } from "../../../domain/repositories/user.repository"
import { UserResponseDto } from "../../dtos/response/user.dto"
import { UserMapper } from "../../../infrastructure/mappers/user.mapper"




export default class GetMeUseCase implements IUseCase<IUserTokenPayload,UserResponseDto>{
    constructor(
        private readonly userRepository:IUserRepository
    ){}

    async execute (user:IUserTokenPayload):Promise<UserResponseDto>{
        const foundUser = await this.userRepository.findById(user.userId)

        if (!foundUser) throw new ApplicationError("USER_NOT_FOUND","User not found","NOT_FOUND")

        return UserMapper.toDto(foundUser) as UserResponseDto
    }
}