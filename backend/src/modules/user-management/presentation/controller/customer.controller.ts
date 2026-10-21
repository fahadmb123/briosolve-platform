import { NextFunction,Request,Response } from "express"
import { accessTokenCookie } from "../../../../shared/presentation/http/cookies/cookieConfig"
import { BaseController } from "../../../../shared/presentation/http/controller/baseController"
import { registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig"
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { UserMapper } from "../../infrastructure/mappers/user.mapper"
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service"
import { ApplicationError } from "../../../../shared/application/errors/applicationError"
import { IJwtService } from "../../../../shared/application/Dto/services/jwtDto.service"
import { IGetCustomersUseCase } from "../../application/interfaces/use-cases/customers/get-customers.interface"
import { EmailVerificationUseCaseOutputDto } from "../../application/dtos/response/user/email-verification.dto"
import { UpdateCustomerProfileInputDto } from "../../application/dtos/request/customer/update-customer-profile.dto"
import { RegisterCustomerInput } from "../../application/dtos/request/customer/register-customer.dto"
import { BecomeProviderInput } from "../../application/dtos/request/onboading/become-provider.dto"
import { GetNearbyProvidersDto } from "../../application/dtos/request/customer/get-nearby-providers.dto";
import { GetNearbyProvidersOutputDto } from "../../application/dtos/response/customer/get-nearby-providers-output.dto";





export class CustomerController extends BaseController{
    constructor (
        private readonly getCustomersUseCase:IGetCustomersUseCase,
        private readonly registerCustomerUseCase:IUseCase<RegisterCustomerInput,EmailVerificationUseCaseOutputDto>,
        private readonly updateCustomerProfileUseCase : IUseCase<UpdateCustomerProfileInputDto,void>,
        private readonly imageUploadService: ImageUploadService,
        private readonly sendBecomeProviderOtpUseCase: IUseCase<string,{ registrationId: string; expiresIn: number }>,
        private readonly becomeProviderUseCase: IUseCase<BecomeProviderInput,void>,
        private readonly jwtService : IJwtService,
        private readonly getNearbyProvidersUseCase: IUseCase<GetNearbyProvidersDto, GetNearbyProvidersOutputDto>
    ) {super()}

    register = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const response = await this.registerCustomerUseCase.execute(req.body)

            res.cookie("registration_id",response.registrationId,registrationCookie)

            return this.sendSuccess(res,"OTP sent successfully",{expiresIn: response.expiresIn})
        } catch (err) {
            next(err)
        }
    }

    getCustomers = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const response = await this.getCustomersUseCase.execute({
                page:Number(req.query.page) || 1,
                limit:Number(req.query.limit) || 10,
                filter:req.query.filter as string | undefined,
                search:req.query.search as string | undefined
            })

            return this.sendSuccess(res,"",{
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
            await this.updateCustomerProfileUseCase.execute({id:req.user?.userId!,data:req.body})

            return this.sendSuccess(res,"Updated!")
        } catch (err) {
            next(err)
        }
    }
    
    uploadProfileImage = async (req:Request,res:Response,next:NextFunction) => {
        try {
            if (!req.file) throw new ApplicationError("NO_DATA","No image uploaded","NOT_FOUND")
            const imageUrl = await this.imageUploadService.uploadImage(req.file.buffer, 'profiles')
            
            await this.updateCustomerProfileUseCase.execute({
                id: req.user?.userId!, 
                data: { profile_image: imageUrl }
            })

            return this.sendSuccess(res,"Updated!", { profile_image: imageUrl })
        } catch (err) {
            next(err)
        }
    }
    
    deleteProfileImage = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const { imageUrl } = req.body;

            if (imageUrl) await this.imageUploadService.deleteImageByUrl(imageUrl)

            await this.updateCustomerProfileUseCase.execute({
                id: req.user?.userId!, 
                data: { profile_image: "" }
            })

            return this.sendSuccess(res,"Deleted!", { profile_image: null })
        } catch (err) {
            next(err)
        }
    }

    sendBecomeProviderOtp = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const userId = req.user!.userId
            const response = await this.sendBecomeProviderOtpUseCase.execute(userId)
            res.cookie("registration_id", response.registrationId, registrationCookie)
            return this.sendSuccess(res, "OTP sent successfully", { expiresIn: response.expiresIn })
        } catch (err) {
            next(err)
        }
    }

    becomeProvider = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = req.user!
            const registrationId = req.cookies.registration_id
            const { businessName, experience, bio, services } = req.body
            await this.becomeProviderUseCase.execute({ registrationId, businessName, experience, bio, services })
            
            const newToken = await this.jwtService.generate({ userId: user.userId, role: "PROVIDER" })
            res.cookie("access_token", newToken, accessTokenCookie)
            if (registrationId) res.clearCookie("registration_id")
            return this.sendSuccess(res, "Switched to Provider!")
        } catch (err) {
            console.error("becomeProvider error:", err)
            next(err)
        }
    }

    getNearbyProviders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const response = await this.getNearbyProvidersUseCase.execute({
                userId: user.userId,
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 12,
                search: req.query.search as string | undefined,
                radius: req.query.radius ? Number(req.query.radius) : undefined
            });

            return this.sendSuccess(res, "Nearby providers fetched successfully", response);
        } catch (err) {
            next(err);
        }
    }
}