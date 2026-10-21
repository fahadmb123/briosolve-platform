import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import { accessTokenCookie, registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IGetProvidersUseCase } from "../../application/interfaces/use-cases/providers/get-providers.interface";
import { UserMapper } from "../../infrastructure/mappers/user.mapper";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";
import { UserResponseDto } from "../../application/dtos/response/user/user-dto";
import { RegisterProviderInput } from "../../application/dtos/request/provider/register-provider.dto";
import { EmailVerificationUseCaseOutputDto } from "../../application/dtos/response/user/email-verification.dto";
import { UpdateProviderProfileInputDto } from "../../application/dtos/request/provider/update-provider-profile.dto";
import { SetProviderAvailabilityInputDto } from "../../application/dtos/request/provider/set-provider-availability.dto";
import { GetProviderAvailabilityInputDto } from "../../application/dtos/request/provider/get-provider-availability.dto";
import { GetAvailabilityOverridesInputDto } from "../../application/dtos/request/provider/get-availability-override.dto";
import { CreateAvailabilityOverrideInputDto } from "../../application/dtos/request/provider/create-availability-override.dto";
import { DeleteAvailabilityOverrideInputDto } from "../../application/dtos/request/provider/delete-availability-override.dto";
import { ProviderAvailabilityResponseDto } from "../../application/dtos/response/provider/provider-availability.dto";
import { ProviderAvailabilityOverrideResponseDto } from "../../application/dtos/response/provider/provider-availability-override.dto";
import { CompleteProviderRegistrationInput } from "../../application/dtos/request/provider/complete-provider-registration.dto";
import { BecomeCustomerInputDto } from "../../application/dtos/request/onboading/become-customer.dto";
import { IJwtService } from "../../../../shared/application/Dto/services/jwtDto.service";



export class ProviderController extends BaseController {
    constructor(
        private readonly preRegisterProviderUseCase: IUseCase<RegisterProviderInput, EmailVerificationUseCaseOutputDto>,
        private readonly registerProviderUseCase: IUseCase<CompleteProviderRegistrationInput, UserResponseDto>,
        private readonly updateProviderProfileUseCase: IUseCase<UpdateProviderProfileInputDto, void>,
        private readonly setProviderAvailabilityUseCase: IUseCase<SetProviderAvailabilityInputDto, ProviderAvailabilityResponseDto[]>,
        private readonly getProviderAvailabilityUseCase: IUseCase<GetProviderAvailabilityInputDto, ProviderAvailabilityResponseDto[]>,
        private readonly getProviderAvailabilityOverridesUseCase: IUseCase<GetAvailabilityOverridesInputDto, ProviderAvailabilityOverrideResponseDto[]>,
        private readonly createProviderAvailabilityOverrideUseCase: IUseCase<CreateAvailabilityOverrideInputDto, ProviderAvailabilityOverrideResponseDto>,
        private readonly deleteProviderAvailabilityOverrideUseCase: IUseCase<DeleteAvailabilityOverrideInputDto, void>,
        private readonly sendBecomeCustomerOtpUseCase:IUseCase<string,{ registrationId: string; expiresIn: number }>,
        private readonly imageUploadService: ImageUploadService,
        private readonly getProvidersUseCase: IGetProvidersUseCase,
        private readonly becomeCustomerUseCase: IUseCase<BecomeCustomerInputDto,void>,
        private readonly jwtService : IJwtService
    ) { super(); }

    getProviders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const currentUser = req.user;
            const isCustomer = currentUser?.role === "CUSTOMER";

            const response = await this.getProvidersUseCase.execute({
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || (isCustomer ? 12 : 10),
                filter: isCustomer ? "ACTIVE" : (req.query.filter as string | undefined),
                search: req.query.search as string | undefined
            });

            return this.sendSuccess(res, "", {
                users: response.users.map(u => UserMapper.toDto(u)),
                total: response.total,
                totalPages: response.totalPages
            });
        } catch (err) {
            next(err);
        }
    }

    preRegister = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this.preRegisterProviderUseCase.execute(req.body);

            res.cookie("registration_id", response.registrationId, registrationCookie);

            return this.sendSuccess(res, "OTP sent successfully", { expiresIn: response.expiresIn });
        } catch (err) {
            next(err);
        }
    }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const registrationId = req.cookies.registration_id;
            if (!registrationId) {
                res.status(401).json({ success: false, message: "Registration session expired. Please start over." });
                return;
            }

            const payload: CompleteProviderRegistrationInput = {
                registrationId,
                services: req.body.services,
                experience: req.body.experience,
                bio: req.body.bio
            };

            const user = await this.registerProviderUseCase.execute(payload);

            res.clearCookie("registration_id");

            return this.sendSuccess(res, "Provider account created successfully", UserMapper.toDto(user));
        } catch (err) {
            next(err);
        }
    }

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.updateProviderProfileUseCase.execute({ id: req.user?.userId!, data: req.body });
            return this.sendSuccess(res, "Updated!");
        } catch (err) {
            next(err);
        }
    }

    getAvailability = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.getProviderAvailabilityUseCase!.execute({ userId: req.user?.userId! });
            return this.sendSuccess(res, "Provider availability fetched successfully", data);
        } catch (err) {
            next(err);
        }
    }

    setAvailability = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.setProviderAvailabilityUseCase!.execute({
                userId: req.user?.userId!,
                slots: req.body.slots
            });
            return this.sendSuccess(res, "Updated!", data);
        } catch (err) {
            next(err);
        }
    }

    getAvailabilityOverrides = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.getProviderAvailabilityOverridesUseCase!.execute({ userId: req.user?.userId! });
            return this.sendSuccess(res, "Overrides fetched successfully", data);
        } catch (err) {
            next(err);
        }
    }

    createAvailabilityOverride = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.createProviderAvailabilityOverrideUseCase!.execute({
                userId: req.user?.userId!,
                override_date: req.body.override_date,
                type: req.body.type,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                reason: req.body.reason
            });
            return this.sendSuccess(res, "Override created successfully", data);
        } catch (err) {
            next(err);
        }
    }

    deleteAvailabilityOverride = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.deleteProviderAvailabilityOverrideUseCase!.execute({
                userId: req.user?.userId!,
                overrideId: req.params.id as string
            });
            return this.sendSuccess(res, "Deleted!");
        } catch (err) {
            next(err);
        }
    }

    uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) throw new ApplicationError("NO_DATA", "No image uploaded", "NOT_FOUND")
    
            const imageUrl = await this.imageUploadService!.uploadImage(req.file.buffer, 'profiles')

            await this.updateProviderProfileUseCase.execute({
                id: req.user?.userId!,
                data: { profile_image: imageUrl }
            });

            return this.sendSuccess(res, "Updated!", { profile_image: imageUrl });
        } catch (err) {
            next(err);
        }
    }

    deleteProfileImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.updateProviderProfileUseCase.execute({
                id: req.user?.userId!,
                data: { profile_image: "" }
            });

            return this.sendSuccess(res, "Deleted!", { profile_image: null });
        } catch (err) {
            next(err);
        }
    }

    sendBecomeCustomerOtp = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const userId = req.user!.userId
            const response = await this.sendBecomeCustomerOtpUseCase.execute(userId)
            res.cookie("registration_id", response.registrationId, registrationCookie)
            return this.sendSuccess(res, "OTP sent successfully", { expiresIn: response.expiresIn })
        } catch (err) {
            next(err)
        }
    }

    becomeCustomer = async (req:Request,res:Response,next:NextFunction) => {
        try {
            const user = req.user!
            const registrationId = req.cookies.registration_id
            await this.becomeCustomerUseCase.execute({registrationId})
            
            const newToken = await this.jwtService.generate({ userId: user.userId, role: "CUSTOMER" })
            res.cookie("access_token", newToken, accessTokenCookie)
            if (registrationId) res.clearCookie("registration_id")
            return this.sendSuccess(res, "Switched to CUSTOMER!")
        } catch (err) {
            console.error("becomeProvider error:", err)
            next(err)
        }
    }
}
