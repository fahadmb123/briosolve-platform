import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js";
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js";
import { registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import type {
    EmailVerificationUseCaseOutputDto,
    RegisterProviderInput,
    UpdateProviderProfileInputDto,
    SetProviderAvailabilityInputDto,
    GetProviderAvailabilityInputDto
} from "../../application/Dto/providerDto.js";
import type { CompleteProviderRegistrationInput } from "../../application/use-cases/registerProvider.useCase.js";
import type { User } from "../../domain/entities/user.entity.js";
import type { ProviderAvailability } from "../../domain/entities/providerAvailability.entity.js";

export class ProviderController extends BaseController {
    constructor(
        private readonly preRegisterProviderUseCase: IUseCase<RegisterProviderInput, EmailVerificationUseCaseOutputDto>,
        private readonly registerProviderUseCase: IUseCase<CompleteProviderRegistrationInput, User>,
        private readonly updateProviderProfileUseCase: IUseCase<UpdateProviderProfileInputDto, void>,
        private readonly setProviderAvailabilityUseCase?: IUseCase<SetProviderAvailabilityInputDto, ProviderAvailability[]>,
        private readonly getProviderAvailabilityUseCase?: IUseCase<GetProviderAvailabilityInputDto, ProviderAvailability[]>
    ) { super(); }

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

            return sendSuccess(res, "Provider account created successfully", user);
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
}
