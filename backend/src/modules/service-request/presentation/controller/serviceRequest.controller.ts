import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateServiceRequestInputDto } from "../../application/dtos/request/create-service-request.dto";
import {
    ServiceRequestResponseDto,
    ServiceRequestDetailsDto
} from "../../application/dtos/response/service-request.dto";
import { GetCustomerServiceRequestsInputDto } from "../../application/use-cases/getCustomerServiceRequests.useCase";
import { CancelServiceRequestInputDto } from "../../application/use-cases/cancelServiceRequest.useCase";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";

export class ServiceRequestController extends BaseController {
    constructor(
        private readonly _createServiceRequestUseCase: IUseCase<CreateServiceRequestInputDto, ServiceRequestResponseDto>,
        private readonly _getCustomerServiceRequestsUseCase: IUseCase<GetCustomerServiceRequestsInputDto, ServiceRequestDetailsDto[]>,
        private readonly _cancelServiceRequestUseCase: IUseCase<CancelServiceRequestInputDto, ServiceRequestResponseDto>
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
