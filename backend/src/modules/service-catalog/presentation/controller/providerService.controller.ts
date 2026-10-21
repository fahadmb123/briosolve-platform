import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { sendSuccess } from "../../../../shared/presentation/http/response/response";
import { AddProviderServicesInputDto } from "../../application/dtos/provider/request/add-provider-service.dto";
import { DeleteProviderServiceInputDto } from "../../application/dtos/provider/request/delete-provider-service.dto";
import { DeleteProviderCategoryInputDto } from "../../application/dtos/provider/request/delete-provider-category.dto";


export class ProviderServiceController extends BaseController {
    constructor(
        private readonly getProviderServicesUseCase: IUseCase<string, ProviderService[]>,
        private readonly addProviderServicesUseCase: IUseCase<AddProviderServicesInputDto, ProviderService[]>,
        private readonly deleteProviderServiceUseCase: IUseCase<DeleteProviderServiceInputDto, ProviderService[]>,
        private readonly deleteProviderCategoryUseCase: IUseCase<DeleteProviderCategoryInputDto, ProviderService[]>
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

    deleteProviderCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = this.getCurrentUser(req);
            const id = req.params.id as string;
            const services = await this.deleteProviderCategoryUseCase.execute({
                userId: user.userId,
                categoryId: id
            });
            return sendSuccess(res, "Category removed", services);
        } catch (error) {
            next(error);
        }
    };
}
