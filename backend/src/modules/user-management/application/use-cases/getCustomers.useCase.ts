import { User } from "../../domain/entities/user.entity.js"
import { IGetCustomersUseCase } from "../../domain/interfaces/use-cases/IGetCustomersUseCase.js"
import { IUserRepository } from "../../domain/repositories/IUserRepository.js"




export default class GetCustomersUseCase implements IGetCustomersUseCase{
    constructor(
        private readonly userRepository:IUserRepository
    ){}

    async execute ():Promise<User[]>{
        const users = await this.userRepository.getCustomers()
        return users
    }
}