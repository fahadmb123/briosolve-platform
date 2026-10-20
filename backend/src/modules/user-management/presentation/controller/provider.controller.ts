import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import { sendSuccess } from "../../../../shared/presentation/http/response/response";
import { registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase";
import { IGetProvidersUseCase } from "../../domain/interfaces/use-cases/IGetProvidersUseCase";
import { UserMapper } from "../../infrastructure/mappers/user.mapper";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ImageUploadService } from "../../../../shared/domain/interfaces/services/IImageUpload.service";
import type {
    EmailVerificationUseCaseOutputDto,
    RegisterProviderInput,
    UpdateProviderProfileInputDto,
    SetProviderAvailabilityInputDto,
    GetProviderAvailabilityInputDto,
    CreateAvailabilityOverrideInputDto,
    GetAvailabilityOverridesInputDto,
    DeleteAvailabilityOverrideInputDto
} from "../../application/Dto/providerDto";
import type { CompleteProviderRegistrationInput } from "../../application/use-cases/registerProvider.useCase";
import type { User } from "../../domain/entities/user.entity";
import type { ProviderAvailability } from "../../domain/entities/providerAvailability.entity";
import type { ProviderAvailabilityOverride } from "../../domain/entities/providerAvailabilityOverride.entity";

export class ProviderController extends BaseController {
    constructor(
        private readonly preRegisterProviderUseCase: IUseCase<RegisterProviderInput, EmailVerificationUseCaseOutputDto>,
        private readonly registerProviderUseCase: IUseCase<CompleteProviderRegistrationInput, User>,
        private readonly updateProviderProfileUseCase: IUseCase<UpdateProviderProfileInputDto, void>,
        private readonly setProviderAvailabilityUseCase: IUseCase<SetProviderAvailabilityInputDto, ProviderAvailability[]>,
        private readonly getProviderAvailabilityUseCase: IUseCase<GetProviderAvailabilityInputDto, ProviderAvailability[]>,
        private readonly getProviderAvailabilityOverridesUseCase: IUseCase<GetAvailabilityOverridesInputDto, ProviderAvailabilityOverride[]>,
        private readonly createProviderAvailabilityOverrideUseCase: IUseCase<CreateAvailabilityOverrideInputDto, ProviderAvailabilityOverride>,
        private readonly deleteProviderAvailabilityOverrideUseCase: IUseCase<DeleteAvailabilityOverrideInputDto, void>,
        private readonly imageUploadService: ImageUploadService,
        private readonly getProvidersUseCase: IGetProvidersUseCase
    ) { super(); }

    getProviders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.getCurrentUser(req);

            const response = await this.getProvidersUseCase.execute({
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 10,
                filter: req.query.filter as string | undefined,
                search: req.query.search as string | undefined
            });

            return sendSuccess(res, "", {
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

            return sendSuccess(res, "OTP sent successfully", { expiresIn: response.expiresIn });
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

            return sendSuccess(res, "Provider account created successfully", UserMapper.toDto(user));
        } catch (err) {
            next(err);
        }
    }

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.getCurrentUser(req);
            await this.updateProviderProfileUseCase.execute({ id: req.user?.userId!, data: req.body });
            return sendSuccess(res, "Updated!");
        } catch (err) {
            next(err);
        }
    }

    getAvailability = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.getCurrentUser(req);
            const data = await this.getProviderAvailabilityUseCase!.execute({ userId: req.user?.userId! });
            return sendSuccess(res, "Provider availability fetched successfully", data);
        } catch (err) {
            next(err);
        }
    }

    setAvailability = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.getCurrentUser(req);
            const data = await this.setProviderAvailabilityUseCase!.execute({
                userId: req.user?.userId!,
                slots: req.body.slots
            });
            return sendSuccess(res, "Updated!", data);
        } catch (err) {
            next(err);
        }
    }

    getAvailabilityOverrides = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.getCurrentUser(req);
            const data = await this.getProviderAvailabilityOverridesUseCase!.execute({ userId: req.user?.userId! });
            return sendSuccess(res, "Overrides fetched successfully", data);
        } catch (err) {
            next(err);
        }
    }

    createAvailabilityOverride = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.getCurrentUser(req);
            const data = await this.createProviderAvailabilityOverrideUseCase!.execute({
                userId: req.user?.userId!,
                override_date: req.body.override_date,
                type: req.body.type,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                reason: req.body.reason
            });
            return sendSuccess(res, "Override created successfully", data);
        } catch (err) {
            next(err);
        }
    }

    deleteAvailabilityOverride = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.getCurrentUser(req);
            await this.deleteProviderAvailabilityOverrideUseCase!.execute({
                userId: req.user?.userId!,
                overrideId: req.params.id as string
            });
            return sendSuccess(res, "Deleted!");
        } catch (err) {
            next(err);
        }
    }

    uploadProfileImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.getCurrentUser(req)
            if (!req.file) throw new ApplicationError("NO_DATA", "No image uploaded", "NOT_FOUND")
    
            const imageUrl = await this.imageUploadService!.uploadImage(req.file.buffer, 'profiles')

            await this.updateProviderProfileUseCase.execute({
                id: req.user?.userId!,
                data: { profile_image: imageUrl }
            });

            return sendSuccess(res, "Updated!", { profile_image: imageUrl });
        } catch (err) {
            next(err);
        }
    }

    deleteProfileImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.getCurrentUser(req);

            await this.updateProviderProfileUseCase.execute({
                id: req.user?.userId!,
                data: { profile_image: "" }
            });

            return sendSuccess(res, "Deleted!", { profile_image: null });
        } catch (err) {
            next(err);
        }
    }
}
