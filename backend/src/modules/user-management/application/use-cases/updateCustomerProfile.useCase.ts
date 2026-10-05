import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { ICustomerRepository } from "../../domain/repositories/ICustomerRespository.js";
import { UpdateCustomerProfileInputDto } from "../Dto/userDto.js";




export default class UpdateCustomerProfileUseCase implements IUseCase<UpdateCustomerProfileInputDto,void>{
    constructor(
        private readonly UserRepository:IUserRepository,
        private readonly customerRepository:ICustomerRepository
    ){}
    async execute(input:UpdateCustomerProfileInputDto):Promise<void>{
        
        const user = await this.UserRepository.findById(input.id)
        
        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not found","NOT_FOUND")
        
        await this.customerRepository.updateProfile({id:input.id,data:input.data})
        
        return
    }
}