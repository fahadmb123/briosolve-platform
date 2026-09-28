import { IUpdateUserStatusUseCase } from "../../domain/interfaces/use-cases/IUpdateUserUseCase.js"
import { IUserRepository } from "../../domain/repositories/IUserRepository.js"
import { UpdateUserStatusDto } from "../Dto/userDto.js"



export default class UpdateUserStatusUseCase implements IUpdateUserStatusUseCase{
    constructor(
        private readonly userRepository:IUserRepository
    ){}

    async execute (input:UpdateUserStatusDto):Promise<void>{
        await this.userRepository.updateStatus(input.id,input.status)
        return
    }
}