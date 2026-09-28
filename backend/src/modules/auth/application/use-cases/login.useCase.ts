import { IJwtService } from "../../../../shared/application/Dto/services/jwtDto.service.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IPasswordHasher } from "../../../../shared/domain/interfaces/IPasswordHasher.service.js";
import { Customer } from "../../domain/entities/customer.entity.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ICustomerRepository } from "../../domain/repositories/customer.repository.js";
import { LoginInputDto } from "../dto/authDto.js";


export default class LoginUseCase implements IUseCase<LoginInputDto,{accessToken:string,isExist:Customer}>{
    constructor(
        private readonly customerRepository:ICustomerRepository,
        private readonly passwordHasher:IPasswordHasher,
        private readonly jwtService:IJwtService
    ){}

    async execute (input:LoginInputDto):Promise<{accessToken:string,isExist:Customer}>{
        const isExist = await this.customerRepository.findByEmail(input.email)
        if (!isExist) throw new ApplicationError("USER_NOT_FOUND","User not found","NOT_FOUND")

        const user = await this.customerRepository.findById(isExist.id)
        if (!user) throw new ApplicationError("USER_NOT_EXIST","User not exist","NOT_FOUND")

        const isPasswordValid = await this.passwordHasher.compare(input.password,user?.password_hash!)
        if (!isPasswordValid) throw new ApplicationError("INVALID_PASSWORD","Invalid Password","AUTHORIZATION")

        if (user.status === "INACTIVE") throw new ApplicationError("INACTIVE_ACCOUNT","Inactive Account","AUTHORIZATION")
        if (user.status === "BLOCKED") throw new ApplicationError("BLOCKED_ACCOUNT","Your account has been blocked","AUTHORIZATION")
        
        const accessToken = await this.jwtService.generate({
            userId:user.id,
            role:user.role
        })
        return {accessToken,isExist}
    }
}