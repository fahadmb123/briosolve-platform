import { Request,Response,NextFunction } from "express"
import { IOtpVarificationUseCase } from "../../domain/interfaces/use-cases/IOtpVarificationUseCase.js"
import { OtpVarificationInput } from "../../application/dto/otpDto.js"
import { Customer } from "../../domain/entities/customer.entity.js"
import { IPendingRegistrationStore } from "../../../../shared/domain/interfaces/IPendingRegistration-store.js"
import { IResendOtpUseCase } from "../../domain/interfaces/use-cases/IResendOtpUseCase.js"
import { ResendOtpOutput } from "../../application/use-cases/resendOtp.useCase.js"

class OtpVarificationController {
    constructor (
        private readonly otpVarificationUseCase:IOtpVarificationUseCase<OtpVarificationInput,Customer>,
        private readonly pendingRegistrationStore:IPendingRegistrationStore,
        private readonly resendOtpUseCase: IResendOtpUseCase<string, ResendOtpOutput>
    ) {}

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

    resend = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const registrationId = req.cookies.registration_id
            const response = await this.resendOtpUseCase.execute(registrationId)
            res.status(200).json({
                success: true,
                message: "OTP resent successfully",
                data: {
                    expiresIn: response.expiresIn
                }
            })
        } catch (err) {
            next(err)
        }
    }

    getStatus = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const registrationId = req.cookies.registration_id
            if (!registrationId) {
                return res.status(200).json({ success: true, data: { attempts: 0, expiresIn: 0 } });
            }
            const response = await this.pendingRegistrationStore.get(registrationId)
            let expiresIn = 0;
            if (response && response.otpExpiresAt) {
                expiresIn = Math.max(0, Math.floor((response.otpExpiresAt - Date.now()) / 1000));
            }

            res.status(200).json({
                success :true,
                data:{
                    attempts:response?.attempts || 0,
                    expiresIn
                }
            })
        } catch (err) {
            next(err)
        }
    }
}



export default OtpVarificationController