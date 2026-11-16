import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { IServiceRequestProviderRepository } from "../../domain/repositories/IServiceRequestProviderRepository";
import { ServiceRequestResponseDto } from "../dtos/response/service-request.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { ServiceRequestMapper } from "../../infrastructure/mappers/serviceRequest.mapper";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { ReopenServiceRequestInputDto } from "../dtos/request/reopen-service-request.dto";
import { IUserRepository } from "../../../user-management/domain/repositories/IUserRepository";
import { IAddressRepository } from "../../../user-management/domain/repositories/IAddressRepository";
import { IProviderSelectionService } from "../interfaces/services/IProviderSelectionService";
import { NotificationType } from "../../../notification/domain/entities/notification.entity";
import { logger } from "../../../../shared/logger/logger";

export class ReopenServiceRequestUseCase implements IUseCase<ReopenServiceRequestInputDto, ServiceRequestResponseDto> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _createBulkNotificationUseCase: IUseCase<CreateBulkNotificationRequestDto, NotificationResponseDto[]>,
        private readonly _userRepository: IUserRepository,
        private readonly _addressRepository: IAddressRepository,
        private readonly _providerSelectionService: IProviderSelectionService,
        private readonly _serviceRequestProviderRepository: IServiceRequestProviderRepository
    ) {}

    async execute(input: ReopenServiceRequestInputDto): Promise<ServiceRequestResponseDto> {
        if (!input.customerId) {
            throw new ApplicationError("UNAUTHORIZED", "Customer ID is required", "AUTHENTICATION");
        }

        const resolvedDate = input.specificDate ? new Date(input.specificDate) : null;

        const reopened = await this._serviceRequestRepository.reopen(input.requestId, input.customerId, {
            urgency: input.urgency,
            specificDate: resolvedDate,
            availableTimeFrom: input.availableTimeFrom,
            availableTimeTo: input.availableTimeTo
        });

        if (!reopened) {
            throw new ApplicationError("NOT_FOUND", "Service request not found or cannot be reopened", "NOT_FOUND");
        }

        const customerAddress = await this._addressRepository.findById(reopened.address_id);
        if (!customerAddress) {
            throw new ApplicationError("ADDRESS_NOT_FOUND", "Address Not Found", "NOT_FOUND");
        }

        const customerLat = Number(customerAddress.latitude);
        const customerLng = Number(customerAddress.longitude);

        const providers = await this._userRepository.getActiveProviders();

        const nearestProvidersIds: string[] = await this._providerSelectionService.getNearbyProviderIds({
            providers,
            customerId: input.customerId,
            customerLat,
            customerLng,
            subServiceId: reopened.subservice_id || ""
        });

        const matchedProviderProfileIds = providers
            .filter((p) => nearestProvidersIds.includes(p.id) && p.provider_profile?.id)
            .map((p) => p.provider_profile!.id);

        if (matchedProviderProfileIds.length > 0) {
            await this._serviceRequestProviderRepository.createMany(
                reopened.id,
                matchedProviderProfileIds
            );
        }

        const profileToUserIdMap = new Map<string, string>();
        for (const p of providers) {
            if (p.provider_profile?.id) {
                profileToUserIdMap.set(p.provider_profile.id, p.id);
            }
        }

        try {
            const matchedProviders = await this._serviceRequestProviderRepository.findByServiceRequestId(reopened.id);
            const existingProviderUserIds = matchedProviders
                .map((p) => p.provider?.user_id || profileToUserIdMap.get(p.provider_id))
                .filter((uid): uid is string => Boolean(uid));

            const allProviderRecipientIds = Array.from(
                new Set([...nearestProvidersIds, ...existingProviderUserIds])
            );

            if (allProviderRecipientIds.length > 0) {
                const bulkNotification: CreateBulkNotificationRequestDto = {
                    recipientIds: allProviderRecipientIds,
                    title: "New Service Request",
                    title_code: "NEW_SERVICE_REQUEST",
                    message: `${reopened.title} needed by ${input.specificDate || input.urgency}`,
                    type: "INFO" as NotificationType
                };
                await this._createBulkNotificationUseCase.execute(bulkNotification);
            }
        } catch (error) {
            logger.error(
                { err: error, requestId: reopened.id },
                "Failed to notify matched providers about reopened service request"
            );
        }

        return ServiceRequestMapper.toDto(reopened);
    }
}
