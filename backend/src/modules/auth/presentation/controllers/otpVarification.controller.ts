import { Request,Response,NextFunction } from "express"
import { OtpVarificationInput } from "../../application/dto/otpDto.js"
import { Customer } from "../../domain/entities/customer.entity.js"
import { IPendingCustomerRegistration, IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js"
import { ResendOtpOutput } from "../../application/use-cases/resendOtp.useCase.js"
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js"
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js"

class OtpVarificationController {
    constructor (
        private readonly otpVarificationUseCase:IUseCase<OtpVarificationInput,{response:Customer | IPendingCustomerRegistration,for:string}>,
        private readonly pendingRegistrationStore:IPendingRegistrationStore,
        private readonly resendOtpUseCase: IUseCase<string, ResendOtpOutput>
    ) {}

    validate = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const registrationId = req.cookies.registration_id
            const otp = req.body.otp
            const response  = await this.otpVarificationUseCase.execute({ registrationId, otp })

            response.for === "FORGOT_PASSWORD" ? res.cookie("reset_password",registrationId , {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
                path: "/"
            }) : null

            return sendSuccess(res,"Acount Created",response.response)
        } catch (err) {
            next(err)
        }
    }

    resend = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const registrationId = req.cookies.registration_id
            
            const response = await this.resendOtpUseCase.execute(registrationId)

            return sendSuccess(res,"OTP resent successfully",{expiresIn: response.expiresIn})
    
        } catch (err) {
            next(err)
        }
    }

    getStatus = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const registrationId = req.cookies.registration_id

            if (!registrationId) return res.status(200).json({ success: true, data: { attempts: 0, expiresIn: 0 } })

            const response = await this.pendingRegistrationStore.get(registrationId)

            let expiresIn = 0

            if (response && response.otpExpiresAt) expiresIn = Math.max(0, Math.floor((response.otpExpiresAt - Date.now()) / 1000))

            return sendSuccess(res,"",{attempts:response?.attempts || 0,expiresIn})
        } catch (err) {
            next(err)
        }
    }
}



export default OtpVarificationController