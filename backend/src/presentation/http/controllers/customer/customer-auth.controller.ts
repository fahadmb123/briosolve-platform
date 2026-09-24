import { Request,Response,NextFunction } from "express"
import { RegisterCustomerUseCase } from "../../../../application/interfaces/use-case/customer/register-customer.use-case.js"

class CustomerAuthController {
    constructor (private readonly registerCustomerUseCase:RegisterCustomerUseCase) {}

    register = async (req:Request,res:Response,next:NextFunction) => {
        try {
            console.log("Controller Reached")
            await this.registerCustomerUseCase.execute({name:"fahad",email:"fafgafefe",password:"1234"})
            console.log("After")
        } catch (err) {
            throw (err)
        }
    }
}



export default CustomerAuthController