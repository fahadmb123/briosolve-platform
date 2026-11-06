import { BaseController } from "../../../../shared/base/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateServiceRequestInputDto } from "../../application/dtos/request/create-service-request.dto";
import { UpdateServiceRequestDto } from "../../application/dtos/request/update-service-request.dto";
import {
    ServiceRequestResponseDto,
    ServiceRequestDetailsDto,
    GetCustomerRequestsOutputDto,
    GetProviderRequestsOutputDto,
    GetAdminServiceRequestsInputDto,
    GetAdminRequestsOutputDto
} from "../../application/dtos/response/service-request.dto";
import { GetCustomerServiceRequestsInputDto } from "../../application/use-cases/getCustomerServiceRequests.useCase";
import { GetProviderServiceRequestsInputDto } from "../../application/use-cases/getProviderServiceRequests.useCase";
import { CancelServiceRequestInputDto } from "../../application/use-cases/cancelServiceRequest.useCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class ServiceRequestController extends BaseController {
    constructor(
        private readonly _createServiceRequestUseCase: IUseCase<CreateServiceRequestInputDto, ServiceRequestResponseDto>,
        private readonly _getCustomerServiceRequestsUseCase: IUseCase<GetCustomerServiceRequestsInputDto, GetCustomerRequestsOutputDto>,
        private readonly _cancelServiceRequestUseCase: IUseCase<CancelServiceRequestInputDto, ServiceRequestResponseDto>,
        private readonly _updateServiceRequestUseCase: IUseCase<UpdateServiceRequestDto, ServiceRequestDetailsDto>,
        private readonly _getProviderServiceRequestsUseCase: IUseCase<GetProviderServiceRequestsInputDto, GetProviderRequestsOutputDto>,
        private readonly _getAdminServiceRequestsUseCase: IUseCase<GetAdminServiceRequestsInputDto, GetAdminRequestsOutputDto>,
        private readonly _adminCancelServiceRequestUseCase: IUseCase<string, void>
    ) {
        super();
    }

    createServiceRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = req.user?.userId;
            if (!customerId) {
                throw new ApplicationError("UNAUTHORIZED", "Customer ID is required", "AUTHENTICATION");
            }

            const response = await this._createServiceRequestUseCase.execute({
                ...req.body,
                customerId
            });

            return this.sendSuccess(res, "Service request created successfully", response, 201);
        } catch (error) {
            next(error);
        }
    };

    getMyServiceRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = req.user?.userId;
            if (!customerId) {
                throw new ApplicationError("UNAUTHORIZED", "Customer ID is required", "AUTHENTICATION");
            }

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string | undefined;
            const status = req.query.status as string | undefined;
            const sortBy = req.query.sortBy as "NEWEST" | "OLDEST" | undefined;

            const response = await this._getCustomerServiceRequestsUseCase.execute({
                customerId,
                page,
                limit,
                search,
                status,
                sortBy
            });

            return this.sendSuccess(res, "Customer service requests retrieved successfully", response, 200);
        } catch (error) {
            next(error);
        }
    };

    getProviderServiceRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new ApplicationError("UNAUTHORIZED", "Provider user ID is required", "AUTHENTICATION");
            }

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string | undefined;
            const urgency = req.query.urgency as string | undefined;
            const budgetType = req.query.budgetType as string | undefined;
            const sortBy = req.query.sortBy as "NEWEST" | "URGENT" | "BUDGET_HIGH" | undefined;

            const response = await this._getProviderServiceRequestsUseCase.execute({
                userId,
                page,
                limit,
                search,
                urgency,
                budgetType,
                sortBy
            });

            return this.sendSuccess(res, "Provider service requests retrieved successfully", response, 200);
        } catch (error) {
            next(error);
        }
    };

    updateServiceRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = req.user?.userId;
            if (!customerId) {
                throw new ApplicationError("UNAUTHORIZED", "Customer ID is required", "AUTHENTICATION");
            }

            const requestId = req.params.id as string;
            const response = await this._updateServiceRequestUseCase.execute({
                ...req.body,
                id: requestId,
                customerId,
                imageUrls: req.body.images
            });

            return this.sendSuccess(res, "Service request updated successfully", response, 200);
        } catch (error) {
            next(error);
        }
    };

    cancelServiceRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = req.user?.userId;
            if (!customerId) {
                throw new ApplicationError("UNAUTHORIZED", "Customer ID is required", "AUTHENTICATION");
            }

            const requestId = req.params.id as string;
            const response = await this._cancelServiceRequestUseCase.execute({
                customerId,
                requestId
            });

            return this.sendSuccess(res, "Service request cancelled successfully", response, 200);
        } catch (error) {
            next(error);
        }
    };

    getAdminServiceRequests = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string | undefined;
            const status = req.query.status as string | undefined;
            const sortBy = req.query.sortBy as "NEWEST" | "OLDEST" | undefined;

            const response = await this._getAdminServiceRequestsUseCase.execute({
                page,
                limit,
                search,
                status,
                sortBy
            });

            return this.sendSuccess(res, "Admin service requests retrieved successfully", response, 200);
        } catch (error) {
            next(error);
        }
    };

    adminCancelServiceRequest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const requestId = req.params.id as string;
            await this._adminCancelServiceRequestUseCase.execute(requestId);
            return this.sendSuccess(res, "Service request cancelled successfully", null, 200);
        } catch (error) {
            next(error);
        }
    };
}
