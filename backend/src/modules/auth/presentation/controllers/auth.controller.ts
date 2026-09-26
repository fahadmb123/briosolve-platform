import { NextFunction ,Response,Request} from "express"
import { LoginInputDto } from "../../application/dto/authDto.js"
import { ILoginUseCase } from "../../domain/interfaces/use-cases/ILoginUseCase.js"
import { Customer } from "../../domain/entities/customer.entity.js"



export class AuthController {
    constructor (
        private readonly loginUseCase:ILoginUseCase<LoginInputDto,{accessToken:string,isExist:Customer}>
    ) {}

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
}