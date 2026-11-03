import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestResponseDto } from "../dtos/response/service-request.dto";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ServiceRequestMapper } from "../../infrastructure/mappers/serviceRequest.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { logger } from "../../../../shared/infrastructure/logger/logger";

export interface CancelServiceRequestInputDto {
    customerId: string;
    requestId: string;
}

export class CancelServiceRequestUseCase implements IUseCase<CancelServiceRequestInputDto, ServiceRequestResponseDto> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _createNotificationUseCase: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: CancelServiceRequestInputDto): Promise<ServiceRequestResponseDto> {
        if (!input.customerId) {
            throw new ApplicationError("UNAUTHORIZED", "Customer ID is required", "AUTHENTICATION");
        }
        if (!input.requestId) {
            throw new ApplicationError("VALIDATION", "Request ID is required", "VALIDATION");
        }

        const cancelled = await this._serviceRequestRepository.cancel(input.requestId, input.customerId);
        if (!cancelled) {
            throw new ApplicationError("NOT_FOUND", "Service request not found or cannot be cancelled", "NOT_FOUND");
        }

        const notification: CreateNotificationRequestDto = {
            recipientId: input.customerId,
            type: "INFO",
            title_code: "SERVICE_REQUEST_CANCELLED",
            title: "Service Request Cancelled",
            message: `Your service request "${cancelled.title}" has been cancelled.`
        };

        try {
            await this._createNotificationUseCase.execute(notification);
        } catch (error) {
            logger.error(
                { err: error, customerId: input.customerId, requestId: input.requestId },
                "Failed to create service request cancellation notification"
            );
        }

        return ServiceRequestMapper.toDto(cancelled);
    }
}
