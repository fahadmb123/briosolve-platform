import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { IServiceRequestProviderRepository } from "../../domain/repositories/IServiceRequestProviderRepository";
import { ServiceRequestResponseDto } from "../dtos/response/service-request.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { ServiceRequestMapper } from "../../infrastructure/mappers/serviceRequest.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { logger } from "../../../../shared/logger/logger";

export interface CancelServiceRequestInputDto {
    customerId: string;
    requestId: string;
}

export class CancelServiceRequestUseCase implements IUseCase<CancelServiceRequestInputDto, ServiceRequestResponseDto> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _createNotificationUseCase: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>,
        private readonly _createBulkNotificationUseCase: IUseCase<CreateBulkNotificationRequestDto, NotificationResponseDto[]>,
        private readonly _serviceRequestProviderRepository: IServiceRequestProviderRepository
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

        const customerNotification: CreateNotificationRequestDto = {
            recipientId: input.customerId,
            type: "INFO",
            title_code: "SERVICE_REQUEST_CANCELLED",
            title: "Service Request Cancelled",
            message: `Your service request "${cancelled.title}" has been cancelled.`
        };

        try {
            await this._createNotificationUseCase.execute(customerNotification);
        } catch (error) {
            logger.error(
                { err: error, customerId: input.customerId, requestId: input.requestId },
                "Failed to create service request cancellation notification"
            );
        }

        try {
            const matchedProviders = await this._serviceRequestProviderRepository.findByServiceRequestId(input.requestId);
            const providerUserIds = matchedProviders
                .map((p) => p.provider?.user_id)
                .filter((uid): uid is string => Boolean(uid));

            if (providerUserIds.length > 0) {
                const bulkNotification: CreateBulkNotificationRequestDto = {
                    recipientIds: providerUserIds,
                    title: "Service Request Cancelled",
                    title_code: "SERVICE_REQUEST_CANCELLED",
                    message: `Service request "${cancelled.title}" has been cancelled by the customer.`,
                    type: "INFO"
                };
                await this._createBulkNotificationUseCase.execute(bulkNotification);
            }
        } catch (error) {
            logger.error(
                { err: error, requestId: input.requestId },
                "Failed to notify matched providers about cancelled service request"
            );
        }

        return ServiceRequestMapper.toDto(cancelled);
    }
}
