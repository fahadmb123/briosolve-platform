import { RegisterCustomerUseCase } from "../../../interfaces/use-case/customer/register-customer.use-case.js";
import type { RegisterCustomerInput } from "../../../dto/customer/customer-auth.type.js";
import { CustomerAuthRepository } from "../../../../domain/repositories/customer.repository.js";
import { ApplicationError } from "../../../errors/application-error.js";
import { PasswordHasher } from "../../../interfaces/services/password-hasher.service.js";
import { Customer } from "../../../../domain/entities/customer/customer-auth.entity.js";



export default class RegisterCustomerUseCaseImpl implements RegisterCustomerUseCase {
    constructor(private readonly customerAuthRepository : CustomerAuthRepository,readonly passwordHasher:PasswordHasher){}

    async execute (input:RegisterCustomerInput):Promise<Customer>{
        try {
            const isEmailExist = await this.customerAuthRepository.findByEmail(input.email)
            if (isEmailExist) throw new ApplicationError("USER_EMAIL_ALREADY_EXIST","User with email already exist","CONFLICT")
            
            input.password = await this.passwordHasher.hash(input.password)
            const customer = await this.customerAuthRepository.createCustomer(input)
            return customer
        } catch (err) {
            throw(err)
        }
    }
}