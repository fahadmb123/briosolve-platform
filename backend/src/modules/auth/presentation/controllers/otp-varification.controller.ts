import { Request,Response,NextFunction } from "express"
import { IUseCase } from "../../../../shared/application/interfaces/use-case/use-case.js"



class OtpVarificationController {
    constructor (private readonly otpVarificationUseCase:IUseCase<string,void>) {}

    validate = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const registrationId = req.cookies.registration_id
            const response  = await this.otpVarificationUseCase.execute(registrationId)
        } catch (err) {
            next(err)
        }
    }
}



export default OtpVarificationController