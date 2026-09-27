import { NextFunction ,Response,Request} from "express"
import { LoginInputDto } from "../../application/dto/authDto.js"
import { ILoginUseCase } from "../../domain/interfaces/use-cases/ILoginUseCase.js"
import { Customer } from "../../domain/entities/customer.entity.js"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js"
import { IGetMeUseCase } from "../../domain/interfaces/use-cases/IGetMe.useCase.js"
import { IUserTokenPayload } from "../../../../shared/domain/interfaces/IToken.js"



export class AuthController extends BaseController{
    constructor (
        private readonly loginUseCase:ILoginUseCase<LoginInputDto,{accessToken:string,isExist:Customer}>,
        private readonly getMeUseCase:IGetMeUseCase<IUserTokenPayload,Customer>
    ) {super()}

    login = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const response = await this.loginUseCase.execute(req.body)
            res.cookie("access_token", response.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
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

    
}