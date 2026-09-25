import { RegisterCustomerUseCase } from "../../../interfaces/use-case/customer/register-customer.use-case.js";
import type { RegisterCustomerInput } from "../../../dto/customer/customer-auth.type.js";
import { CustomerAuthRepository } from "../../../../domain/repositories/customer.repository.js";



export default class RegisterCustomerUseCaseImpl implements RegisterCustomerUseCase {
    constructor(private readonly customerAuthRepository : CustomerAuthRepository){}
    async execute (input:RegisterCustomerInput):Promise<void>{
        const customer = await this.customerAuthRepository.createCustomer(input)

    }
}