import { Request,Response,NextFunction } from "express"
import { RegisterCustomerUseCase } from "../../../../application/interfaces/use-case/customer/register-customer.use-case.js"



class CustomerAuthController {
    constructor (private readonly registerCustomerUseCase:RegisterCustomerUseCase) {}

    register = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const customer = await this.registerCustomerUseCase.execute(req.body)
            return res.status(200).json(customer)
        } catch (err) {
            next(err)
        }
    }
}



export default CustomerAuthController