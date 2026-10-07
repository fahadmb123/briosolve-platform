import { NextFunction,Request,Response } from "express"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js"
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js"
import { IGetCustomersUseCase } from "../../domain/interfaces/use-cases/IGetCustomersUseCase.js"
import { registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig.js"
import { EmailVerificationUseCaseOutputDto, RegisterCustomerInput } from "../../application/Dto/customerDto.js"
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js"
import { UpdateCustomerProfileInputDto } from "../../application/Dto/userDto.js"
import { UserResponseMapper } from "../mappers/userResponse.mapper.js"






export class CustomerController extends BaseController{
    constructor (
        private readonly getCustomersUseCase:IGetCustomersUseCase,
        private readonly registerCustomerUseCase:IUseCase<RegisterCustomerInput,EmailVerificationUseCaseOutputDto>,
        private readonly updateCustomerProfileUseCase : IUseCase<UpdateCustomerProfileInputDto,void>
    ) {super()}

    register = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const response = await this.registerCustomerUseCase.execute(req.body)

            res.cookie("registration_id",response.registrationId,registrationCookie)

            return sendSuccess(res,"OTP sent successfully",{expiresIn: response.expiresIn})
        } catch (err) {
            next(err)
        }
    }

    getCustomers = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
    
            const response = await this.getCustomersUseCase.execute({
                page:Number(req.query.page) || 1,
                limit:Number(req.query.limit) || 10,
                filter:req.query.filter as string | undefined,
                search:req.query.search as string | undefined
            })

            return sendSuccess(res,"",{
                users: response.users.map(u => UserResponseMapper.toDto(u)),
                total: response.total,
                totalPages: response.totalPages
            })
        } catch (err) {
            next(err)
        }
    }

    updateProfile = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            await this.updateCustomerProfileUseCase.execute({id:req.user?.userId!,data:req.body})

            return sendSuccess(res,"Updated")
        } catch (err) {
            next(err)
        }
    }
    
    
}