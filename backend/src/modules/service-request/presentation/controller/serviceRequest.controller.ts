import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateServiceRequestInputDto } from "../../application/dtos/request/create-service-request.dto";
import { ServiceRequestResponseDto } from "../../application/dtos/response/service-request.dto";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";

export class ServiceRequestController extends BaseController {
    constructor(
        private readonly _createServiceRequestUseCase: IUseCase<CreateServiceRequestInputDto, ServiceRequestResponseDto>
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
}
