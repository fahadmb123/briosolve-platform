import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/IUserRepository"
import { getCustomersDto } from "../Dto/getCustomersDto"
import { IGetCustomersUseCase } from "../interfaces/use-cases/customers/get-customers.interface";




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