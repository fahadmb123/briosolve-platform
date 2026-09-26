import { Request,Response,NextFunction } from "express"
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js"
import { RegisterCustomerInput } from "../../domain/repositories/customer.repository.js"
import { RegisterCustomerOutput } from "../../application/dto/customerDto.js"



class CustomerAuthController {
    constructor (private readonly registerCustomerUseCase:IUseCase<RegisterCustomerInput,RegisterCustomerOutput>) {}

    register = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const response = await this.registerCustomerUseCase.execute(req.body)
            res.cookie("registration_id", response.registrationId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 1000,
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
}



export default CustomerAuthController