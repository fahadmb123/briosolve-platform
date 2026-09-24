import { RegisterCustomerUseCase } from "../../interfaces/use-case/customer/register-customer.use-case.js";
import type { CustomerRegistrationInputType } from "../../../presentation/http/validators/auth/registerCustomer.schema.js";



export default class RegisterCustomerUseCaseImpl implements RegisterCustomerUseCase {
    async execute (input:CustomerRegistrationInputType):Promise<void>{
        console.log("This is From usecase Register")
    }
}