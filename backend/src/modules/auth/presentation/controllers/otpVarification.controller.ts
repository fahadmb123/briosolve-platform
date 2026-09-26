import { Request,Response,NextFunction } from "express"
import { IOtpVarificationUseCase } from "../../domain/interfaces/use-cases/IOtpVarificationUseCase.js"
import { OtpVarificationInput } from "../../application/dto/otpDto.js"
import { Customer } from "../../domain/entities/customer.entity.js"

class OtpVarificationController {
    constructor (private readonly otpVarificationUseCase:IOtpVarificationUseCase<OtpVarificationInput,Customer>) {}

    validate = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const registrationId = req.cookies.registration_id
            const otp = req.body.otp
            const response  = await this.otpVarificationUseCase.execute({ registrationId, otp })
            res.status(201).json({
                success :true,
                message:"Acount Created",
                data:response
            })
        } catch (err) {
            next(err)
        }
    }
}



export default OtpVarificationController