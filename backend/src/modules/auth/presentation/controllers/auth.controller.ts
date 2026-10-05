import { NextFunction ,Response,Request} from "express"
import {LoginInputDto, SendSmsOtpUseCaseInputDto, SendSmsOtpUseCaseOutputDto } from "../../application/dto/authDto.js"
import { User } from "../../domain/entities/user.entity.js"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js"
import { IUserTokenPayload } from "../../../../shared/domain/interfaces/IToken.js"
import { EmailVerificationUseCaseInputDto, EmailVerificationUseCaseOutputDto, UpdateEmailUseCaseInputDto, UpdateEmailUseCaseOutputDto } from "../../application/dto/customerDto.js"
import { ResetPasswordDto } from "../../application/dto/resetPasswordDtos.js"
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js"
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js"
import { accessTokenCookie, registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig.js"
import { TextBeeSmsService } from "../../../../infrastructure/services/textbee/TextBeeSmsService.js"




export class AuthController extends BaseController{
    constructor (
        private readonly loginUseCase:IUseCase<LoginInputDto,{accessToken:string,isExist:User}>,
        private readonly getMeUseCase:IUseCase<IUserTokenPayload,User>,
        private readonly emailVerification : IUseCase<EmailVerificationUseCaseInputDto,EmailVerificationUseCaseOutputDto>,
        private readonly resetPasswordUseCase:IUseCase<ResetPasswordDto,void>,
        private readonly updateEmailUseCase:IUseCase<UpdateEmailUseCaseInputDto,UpdateEmailUseCaseOutputDto>,
        private readonly sendSmsOtpUseCase:IUseCase<SendSmsOtpUseCaseInputDto,SendSmsOtpUseCaseOutputDto>
        
    ) {super()}

    login = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const response = await this.loginUseCase.execute(req.body)
             
            res.cookie("access_token",response.accessToken,accessTokenCookie)

            return sendSuccess(res,"LoggedIn Successfully",response.isExist)
        } catch (err) {
            next(err)
        }
    }
    getMe = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = this.getCurrentUser(req)

            const response = await this.getMeUseCase.execute(user)

            return sendSuccess(res,"",response)
        } catch (err) {
            next(err)
        }
    }


    logout = async (req:Request,res:Response,next:NextFunction) => {
        try {
            res.clearCookie("access_token")

            return sendSuccess(res,"Logged Out")
        } catch (err) {
            next(err)
        }
    }

    emailVerify = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const work = req.query.work || ""
            let response = null

            if (work === "UPDATE") {
                const user = this.getCurrentUser(req)
                response = await this.updateEmailUseCase.execute({email:req.body.email, userId: user.userId})
            }else {
                response = await this.emailVerification.execute({email:req.body.email})
            }

            res.cookie("registration_id",response.registrationId,registrationCookie)
            
            return sendSuccess(res,"OTP Sent Successfully",{expiresIn: response.expiresIn}) 
        } catch (err) {
            next(err)
        }
    }

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
}