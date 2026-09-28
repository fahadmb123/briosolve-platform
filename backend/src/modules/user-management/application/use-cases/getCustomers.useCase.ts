import { User } from "../../domain/entities/user.entity.js"
import { IGetCustomersUseCase } from "../../domain/interfaces/use-cases/IGetCustomersUseCase.js"
import { IUserRepository } from "../../domain/repositories/IUserRepository.js"
import { getCustomersDto } from "../Dto/getCustomersDto.js"




export default class GetCustomersUseCase implements IGetCustomersUseCase{
    constructor(
        private readonly userRepository:IUserRepository
    ){}

    async execute (input:getCustomersDto):Promise<{users:User[],total:number,totalPages:number}>{
        const response = await this.userRepository.getCustomers(input)

        const totalPages = Math.ceil(response.total / input.limit)
        return {
            users:response.users,
            total:response.total,
            totalPages
        }
    }
}