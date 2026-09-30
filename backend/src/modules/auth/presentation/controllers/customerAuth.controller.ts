import { Request,Response,NextFunction } from "express"
import { RegisterCustomerInput } from "../../domain/repositories/customer.repository.js"
import { RegisterCustomerOutput } from "../../application/dto/customerDto.js"
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js"
import { registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig.js"
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js"



class CustomerAuthController {
    constructor (private readonly registerCustomerUseCase:IUseCase<RegisterCustomerInput,RegisterCustomerOutput>) {}

    register = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const response = await this.registerCustomerUseCase.execute(req.body)

            res.cookie("registration_id",response.registrationId,registrationCookie)

            return sendSuccess(res,"OTP sent successfully",{expiresIn: response.expiresIn})
        } catch (err) {
            next(err)
        }
    }
}



export default CustomerAuthController