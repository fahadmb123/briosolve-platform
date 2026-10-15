import { User } from "../../domain/entities/user.entity"
import { IGetCustomersUseCase } from "../../domain/interfaces/use-cases/IGetCustomersUseCase"
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { getCustomersDto } from "../Dto/getCustomersDto"




export default class GetCustomersUseCase implements IGetCustomersUseCase{
    constructor(
        private readonly userRepository:IUserRepository
    ){}

    async execute (input:getCustomersDto):Promise<{users:User[],total:number,totalPages:number}>{
        const response = await this.userRepository.getUsersWithRole({
            role: "CUSTOMER",
            ...input
        });

        const totalPages = Math.ceil(response.total / input.limit)
        return {
            users:response.users,
            total:response.total,
            totalPages
        }
    }
}