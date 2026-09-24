import { Request,Response,NextFunction } from "express"
import { RegisterCustomerUseCase } from "../../../../application/interfaces/use-case/customer/register-customer.use-case.js"

class CustomerAuthController {
    constructor (private readonly registerCustomerUseCase:RegisterCustomerUseCase) {}

    async register(req:Request,res:Response,next:NextFunction){
        await this.registerCustomerUseCase.execute(req.body)
    }
}



export default CustomerAuthController