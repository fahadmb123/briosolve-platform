import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { AddProviderServicesInputDto } from "../../application/dtos/provider/request/add-provider-service.dto";
import { DeleteProviderServiceInputDto } from "../../application/dtos/provider/request/delete-provider-service.dto";
import { DeleteProviderCategoryInputDto } from "../../application/dtos/provider/request/delete-provider-category.dto";
import { ProviderServiceResponseDto } from "../../application/dtos/provider/response/provider-service.dto";

export class ProviderServiceController extends BaseController {
    constructor(
        private readonly getProviderServicesUseCase: IUseCase<string, ProviderServiceResponseDto[]>,
        private readonly addProviderServicesUseCase: IUseCase<AddProviderServicesInputDto, ProviderServiceResponseDto[]>,
        private readonly deleteProviderServiceUseCase: IUseCase<DeleteProviderServiceInputDto, ProviderServiceResponseDto[]>,
        private readonly deleteProviderCategoryUseCase: IUseCase<DeleteProviderCategoryInputDto, ProviderServiceResponseDto[]>
    ) {
        super();
    }

    getProviderServices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const services = await this.getProviderServicesUseCase.execute(user.userId);
            return this.sendSuccess(res, "Provider services fetched successfully", services);
        } catch (error) {
            next(error);
        }
    };

    addProviderServices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const { serviceIds } = req.body as { serviceIds: string[] };
            const services = await this.addProviderServicesUseCase.execute({
                userId: user.userId,
                serviceIds: Array.isArray(serviceIds) ? serviceIds : []
            });
            return this.sendSuccess(res, "Services added", services);
        } catch (error) {
            next(error);
        }
    };

    deleteProviderService = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const id = req.params.id as string;
            const services = await this.deleteProviderServiceUseCase.execute({
                userId: user.userId,
                serviceId: id
            });
            return this.sendSuccess(res, "Service removed", services);
        } catch (error) {
            next(error);
        }
    };

    deleteProviderCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user!;
            const id = req.params.id as string;
            const services = await this.deleteProviderCategoryUseCase.execute({
                userId: user.userId,
                categoryId: id
            });
            return this.sendSuccess(res, "Category removed", services);
        } catch (error) {
            next(error);
        }
    };
}
