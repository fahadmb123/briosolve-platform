import { NextFunction,Response,Request } from "express";
import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import { IUseCase } from "../../../../shared/domain/interfaces/use-cases/IUseCase";
import { sendSuccess } from "../../../../shared/presentation/http/response/response";
import { registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig";
import { ResetPasswordDto } from "../../application/dto/request/reset-password.dto";
import { SendSmsOtpUseCaseOutputDto } from "../../application/dto/response/send-sms-otp.dto";
import { UpdatePasswordInputDto } from "../../application/dto/request/update-password.dto";
import { SendSmsOtpUseCaseInputDto } from "../../application/dto/request/send-sms-otp.dto";




export class SecurityController extends BaseController {
    constructor (
        private readonly resetPasswordUseCase:IUseCase<ResetPasswordDto,void>,
        private readonly sendSmsOtpUseCase:IUseCase<SendSmsOtpUseCaseInputDto,SendSmsOtpUseCaseOutputDto>,
        private readonly updatePasswordUseCase :IUseCase<UpdatePasswordInputDto,void>,
        private readonly deletePhoneUseCase : IUseCase<string,void>
    ) {super()}

    resetPassword = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const registrationId = req.cookies.reset_password

            await this.resetPasswordUseCase.execute({registrationId,password:req.body.password})

            return sendSuccess(res,"Password Updated")
        } catch (err) {
            next(err)
        }
    }


    updatePhone = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = this.getCurrentUser(req)
            const path = req.query.path as string
            
            const response = await this.sendSmsOtpUseCase.execute({phone:req.body.phone,path,id:user.userId})
        
            res.cookie("registration_id",response.registrationId,registrationCookie)
            
            return sendSuccess(res,"OTP Sent Successfully",{expiresIn: response.expiresIn}) 
        } catch (err) {
            next(err)
        }
    }

    updatePassword = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            
            await this.updatePasswordUseCase.execute({id:req.user?.userId as string,data:req.body})

            return sendSuccess(res,"Updated")
        } catch (err) {
            next(err)
        }
    }

    deletePhone = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            
            await this.deletePhoneUseCase.execute(req.user?.userId as string)

            return sendSuccess(res,"Updated")
        } catch (err) {
            next(err)
        }
    }
}