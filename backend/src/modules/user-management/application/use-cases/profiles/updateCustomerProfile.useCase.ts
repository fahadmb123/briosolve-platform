import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ICustomerRepository } from "../../../domain/repositories/ICustomerRespository";
import { UpdateCustomerProfileInputDto } from "../../dtos/request/customer/update-customer-profile.dto";




export default class UpdateCustomerProfileUseCase implements IUseCase<UpdateCustomerProfileInputDto,void>{
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _customerRepository: ICustomerRepository
    ){}
    async execute(input:UpdateCustomerProfileInputDto):Promise<void>{
        
        const user = await this._userRepository.findById(input.id)
        
        if (!user) throw new ApplicationError("USER_NOT_FOUND","User not found","NOT_FOUND")
        
        await this._customerRepository.updateProfile({id:input.id,data:input.data})
        
        return
    }
}