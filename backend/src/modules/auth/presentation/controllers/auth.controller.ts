import { NextFunction ,Response,Request} from "express"
import { LoginInputDto } from "../../application/dto/authDto.js"
import { ILoginUseCase } from "../../domain/interfaces/use-cases/ILoginUseCase.js"
import { Customer } from "../../domain/entities/customer.entity.js"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js"
import { IGetMeUseCase } from "../../domain/interfaces/use-cases/IGetMe.useCase.js"
import { IUserTokenPayload } from "../../../../shared/domain/interfaces/IToken.js"
import { IEmailVerificationUseCase } from "../../domain/interfaces/use-cases/IEmailVerification.useCase.js"
import { RegisterCustomerOutput } from "../../application/dto/customerDto.js"
import { IResetPasswordUseCase } from "../../domain/interfaces/use-cases/IResetPasswordUseCase.js"
import { ResetPasswordDto } from "../../application/dto/resetPasswordDtos.js"



export class AuthController extends BaseController{
    constructor (
        private readonly loginUseCase:ILoginUseCase<LoginInputDto,{accessToken:string,isExist:Customer}>,
        private readonly getMeUseCase:IGetMeUseCase<IUserTokenPayload,Customer>,
        private readonly emailVerification : IEmailVerificationUseCase<string,RegisterCustomerOutput>,
        private readonly resetPasswordUseCase:IResetPasswordUseCase<ResetPasswordDto,void>
    ) {super()}

    login = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const response = await this.loginUseCase.execute(req.body)
            res.cookie("access_token", response.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
                path: "/"
            }).status(200).json({
                success: true,
                message: "Login successful",
                data:response.isExist
            });
        } catch (err) {
            next(err)
        }
    }
    getMe = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = this.getCurrentUser(req)
            const response = await this.getMeUseCase.execute(user)
            res.status(200).json({
                success: true,
                data:response
            });
        } catch (err) {
            next(err)
        }
    }
    logout = async (req:Request,res:Response,next:NextFunction) => {
        try {
            res.clearCookie("access_token")
            return res.status(200).json({
                success:true,
                message:"Logged Out"
            })
        } catch (err) {
            next(err)
        }
    }

    emailVerify = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const response = await this.emailVerification.execute(req.body.email)
            res.cookie("registration_id", response.registrationId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 10 * 60 * 1000,
                path: "/"
            }).status(201).json({
                success: true,
                message: "OTP sent successfully",
                data: {
                    expiresIn: response.expiresIn
                }
            })
        } catch (err) {
            next(err)
        }
    }

    resetPassword = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const registrationId = req.cookies.reset_password
            await this.resetPasswordUseCase.execute({registrationId,password:req.body.password})
            res.status(201).json({
                success: true,
                message: "Password Updated"
            })
        } catch (err) {
            next(err)
        }
    }
    
}