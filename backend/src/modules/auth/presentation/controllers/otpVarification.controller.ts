import { Request, Response, NextFunction } from "express"
import { IPendingCustomerRegistration, IPendingRegistrationStore } from "../../../../shared/application/interfaces/IPendingRegistration-store"
import { ResendOtpOutput } from "../../application/use-cases/verification/resendOtp.useCase"
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase"
import { sendSuccess } from "../../../../shared/presentation/http/response/response"
import { registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig"
import { OtpVarificationInput } from "../../application/dtos/request/otp-verification.dto"
import { UserResponseDto } from "../../application/dtos/response/user.dto"

class OtpVarificationController {
    constructor(
        private readonly _otpVarificationUseCase: IUseCase<OtpVarificationInput, { response: UserResponseDto | IPendingCustomerRegistration, for: string, email: string, path?: string }>,
        private readonly _pendingRegistrationStore: IPendingRegistrationStore,
        private readonly _resendOtpUseCase: IUseCase<string, ResendOtpOutput>
    ) { }

    validate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const registrationId = req.cookies.registration_id
            const otp = req.body.otp
            
            const response = await this._otpVarificationUseCase.execute({ registrationId, otp })

            response.for === "FORGOT_PASSWORD" ? res.cookie("reset_password", registrationId, registrationCookie) : null

            let message = "Verification Success";
            if (response.for === "CREATE_PROVIDER" || response.for === "REACTIVATE_ACCOUNT" || response.for === "BECOME_PROVIDER" || response.for === "BECOME_CUSTOMER") {
                message = "Email Verified Successfully";
            } else if (response.for.includes("UPDATE")) {
                message = "Updated";
            } else if (response.for === "CREATE_CUSTOMER") {
                message = "Account Created";
            }

         
const base = response.response || {};
            const dataToReturn = { ...base, email: response.email, phone: (response as any).phone, path: response.path, for: response.for };


            return sendSuccess(res, message, dataToReturn)
        } catch (err) {
            next(err)
        }
    }

    resend = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const registrationId = req.cookies.registration_id

            const response = await this._resendOtpUseCase.execute(registrationId)

            return sendSuccess(res, "OTP resent successfully", { expiresIn: response.expiresIn })
        } catch (err) {
            next(err)
        }
    }

    getStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const registrationId = req.cookies.registration_id

            if (!registrationId) return res.status(200).json({ success: true, data: { attempts: 0, expiresIn: 0 } })

            const response = await this._pendingRegistrationStore.get(registrationId)

            let expiresIn = 0

            if (response && response.otpExpiresAt) expiresIn = Math.max(0, Math.floor((response.otpExpiresAt - Date.now()) / 1000))

            return sendSuccess(res, "", { attempts: response?.attempts || 0, expiresIn, email: response?.email || "", phone: response?.phone || "", for: response?.for || "" })
        } catch (err) {
            next(err)
        }
    }
}



export default OtpVarificationController