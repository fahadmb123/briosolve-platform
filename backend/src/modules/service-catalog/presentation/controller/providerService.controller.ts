import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ProviderService } from "../../domain/entities/providerService.entity.js";
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js";

export class ProviderServiceController extends BaseController {
    constructor(
        private readonly getProviderServicesUseCase: IUseCase<string, ProviderService[]>
    ) {
        super();
    }

    getProviderServices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = this.getCurrentUser(req);
            const services = await this.getProviderServicesUseCase.execute(user.userId);
            return sendSuccess(res, "Provider services fetched successfully", services);
        } catch (error) {
            next(error);
        }
    };
}
