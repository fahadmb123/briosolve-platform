import { NextFunction,Request,Response } from "express"
import { accessTokenCookie } from "../../../../shared/presentation/http/cookies/cookieConfig"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController"
import { sendSuccess } from "../../../../shared/presentation/http/response/response"
import { registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig"
import { EmailVerificationUseCaseOutputDto, RegisterCustomerInput } from "../../application/Dto/customerDto"
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { UpdateCustomerProfileInputDto } from "../../application/Dto/userDto"
import { UserMapper } from "../../infrastructure/mappers/user.mapper"
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service"
import { ApplicationError } from "../../../../shared/application/errors/applicationError"
import { BecomeProviderInput } from "../../application/use-cases/becomeProvider.useCase"
import { IJwtService } from "../../../../shared/application/Dto/services/jwtDto.service"
import { IGetCustomersUseCase } from "../../application/interfaces/use-cases/customers/get-customers.interface"





export class CustomerController extends BaseController{
    constructor (
        private readonly getCustomersUseCase:IGetCustomersUseCase,
        private readonly registerCustomerUseCase:IUseCase<RegisterCustomerInput,EmailVerificationUseCaseOutputDto>,
        private readonly updateCustomerProfileUseCase : IUseCase<UpdateCustomerProfileInputDto,void>,
        private readonly imageUploadService: ImageUploadService,
        private readonly sendBecomeProviderOtpUseCase: IUseCase<string,{ registrationId: string; expiresIn: number }>,
        private readonly becomeProviderUseCase: IUseCase<BecomeProviderInput,void>,
        private readonly jwtService : IJwtService
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
                users: response.users.map(u => UserMapper.toDto(u)),
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

            return sendSuccess(res,"Updated!")
        } catch (err) {
            next(err)
        }
    }
    
    uploadProfileImage = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            if (!req.file) throw new ApplicationError("NO_DATA","No image uploaded","NOT_FOUND")
            const imageUrl = await this.imageUploadService.uploadImage(req.file.buffer, 'profiles')
            
            await this.updateCustomerProfileUseCase.execute({
                id: req.user?.userId!, 
                data: { profile_image: imageUrl }
            })

            return sendSuccess(res,"Updated!", { profile_image: imageUrl })
        } catch (err) {
            next(err)
        }
    }
    
    deleteProfileImage = async (req:Request,res:Response,next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            const { imageUrl } = req.body;

            if (imageUrl) await this.imageUploadService.deleteImageByUrl(imageUrl)

            await this.updateCustomerProfileUseCase.execute({
                id: req.user?.userId!, 
                data: { profile_image: "" }
            })

            return sendSuccess(res,"Deleted!", { profile_image: null })
        } catch (err) {
            next(err)
        }
    }

    sendBecomeProviderOtp = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const { userId } = this.getCurrentUser(req)
            const response = await this.sendBecomeProviderOtpUseCase.execute(userId)
            res.cookie("registration_id", response.registrationId, registrationCookie)
            return sendSuccess(res, "OTP sent successfully", { expiresIn: response.expiresIn })
        } catch (err) {
            next(err)
        }
    }

    becomeProvider = async (req:Request,res:Response,next:NextFunction) => {
        try {
         
            const user = this.getCurrentUser(req)
            const registrationId = req.cookies.registration_id
            const { businessName, experience, bio, services } = req.body
            await this.becomeProviderUseCase.execute({ registrationId, businessName, experience, bio, services })
            
            const newToken = await this.jwtService.generate({ userId: user.userId, role: "PROVIDER" })
            res.cookie("access_token", newToken, accessTokenCookie)
            if (registrationId) res.clearCookie("registration_id")
            return sendSuccess(res, "Switched to Provider!")
        } catch (err) {
            console.error("becomeProvider error:", err)
            next(err)
        }
    }
}