import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ProviderService } from "../../domain/entities/providerService.entity.js";
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js";
import { AddProviderServicesInputDto, DeleteProviderServiceInputDto } from "../../application/Dto/providerService.js";

export class ProviderServiceController extends BaseController {
    constructor(
        private readonly getProviderServicesUseCase: IUseCase<string, ProviderService[]>,
        private readonly addProviderServicesUseCase: IUseCase<AddProviderServicesInputDto, ProviderService[]>,
        private readonly deleteProviderServiceUseCase: IUseCase<DeleteProviderServiceInputDto, ProviderService[]>
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

    addProviderServices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = this.getCurrentUser(req);
            const { serviceIds } = req.body as { serviceIds: string[] };
            const services = await this.addProviderServicesUseCase.execute({
                userId: user.userId,
                serviceIds: Array.isArray(serviceIds) ? serviceIds : []
            });
            return sendSuccess(res, "Services added", services);
        } catch (error) {
            next(error);
        }
    };

    deleteProviderService = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = this.getCurrentUser(req);
            const id = req.params.id as string;
            const services = await this.deleteProviderServiceUseCase.execute({
                userId: user.userId,
                serviceId: id
            });
            return sendSuccess(res, "Service removed", services);
        } catch (error) {
            next(error);
        }
    };
}
