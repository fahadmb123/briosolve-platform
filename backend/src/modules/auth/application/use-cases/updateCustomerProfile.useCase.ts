import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IPasswordHasher } from "../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IUserRepository } from "../../domain/repositories/user.repository.js";
import { UpdateCustomerProfileInputDto } from "../dto/authDto.js";
import { ICustomerRepository } from "../../domain/repositories/customer.respository.js";




export default class UpdateCustomerProfileUseCase implements IUseCase<UpdateCustomerProfileInputDto,void>{
    constructor(
        private readonly UserRepository:IUserRepository,
        private readonly customerRepository:ICustomerRepository
    ){}
    async execute(input:UpdateCustomerProfileInputDto):Promise<void>{
        
        const user = await this.UserRepository.findById(input.id)
        
        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not found","NOT_FOUND")
        
        await this.customerRepository.updateProfile({id:input.id,data:input.data})
        //console.log("I am here ")
        return
    }
}