import { Request,Response,NextFunction } from "express"
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js"



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