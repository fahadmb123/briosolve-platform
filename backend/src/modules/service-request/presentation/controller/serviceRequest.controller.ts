import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateServiceRequestInputDto } from "../../application/dtos/request/create-service-request.dto";
import { UpdateServiceRequestDto } from "../../application/dtos/request/update-service-request.dto";
import {
    ServiceRequestResponseDto,
    ServiceRequestDetailsDto
} from "../../application/dtos/response/service-request.dto";
import { GetCustomerServiceRequestsInputDto } from "../../application/use-cases/getCustomerServiceRequests.useCase";
import { GetProviderServiceRequestsInputDto } from "../../application/use-cases/getProviderServiceRequests.useCase";
import { CancelServiceRequestInputDto } from "../../application/use-cases/cancelServiceRequest.useCase";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";

export class ServiceRequestController extends BaseController {
    constructor(
        private readonly _createServiceRequestUseCase: IUseCase<CreateServiceRequestInputDto, ServiceRequestResponseDto>,
        private readonly _getCustomerServiceRequestsUseCase: IUseCase<GetCustomerServiceRequestsInputDto, ServiceRequestDetailsDto[]>,
        private readonly _cancelServiceRequestUseCase: IUseCase<CancelServiceRequestInputDto, ServiceRequestResponseDto>,
        private readonly _updateServiceRequestUseCase: IUseCase<UpdateServiceRequestDto, ServiceRequestDetailsDto>,
        private readonly _getProviderServiceRequestsUseCase: IUseCase<GetProviderServiceRequestsInputDto, ServiceRequestDetailsDto[]>
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

            const requests = await this._getCustomerServiceRequestsUseCase.execute({ customerId });
            return this.sendSuccess(res, "Customer service requests retrieved successfully", requests, 200);
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

            const requests = await this._getProviderServiceRequestsUseCase.execute({ userId });
            return this.sendSuccess(res, "Provider service requests retrieved successfully", requests, 200);
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
}
