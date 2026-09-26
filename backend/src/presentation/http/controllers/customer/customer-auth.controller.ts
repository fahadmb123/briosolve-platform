import { Request,Response,NextFunction } from "express"
import { RegisterCustomerUseCase } from "../../../../application/interfaces/use-case/customer/register-customer.use-case.js"



class CustomerAuthController {
    constructor (private readonly registerCustomerUseCase:RegisterCustomerUseCase) {}

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