import { Buffer } from "node:buffer";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { IServiceRequestProviderRepository } from "../../domain/repositories/IServiceRequestProviderRepository";
import { ImageUploadService } from "../../../../shared/interfaces/services/IImageUpload.service";
import { UpdateServiceRequestDto } from "../dtos/request/update-service-request.dto";
import { ServiceRequestDetailsDto } from "../dtos/response/service-request.dto";
import { StorageUtil } from "../../../../shared/utils/storage.util";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { NotificationType } from "../../../notification/domain/entities/notification.entity";
import { IUserRepository } from "../../../user-management/domain/repositories/IUserRepository";
import { IAddressRepository } from "../../../user-management/domain/repositories/IAddressRepository";
import { IProviderSelectionService } from "../interfaces/services/IProviderSelectionService";
import { logger } from "../../../../shared/logger/logger";

export class UpdateServiceRequestUseCase implements IUseCase<UpdateServiceRequestDto, ServiceRequestDetailsDto> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _imageUploadService: ImageUploadService,
        private readonly _createBulkNotificationUseCase: IUseCase<CreateBulkNotificationRequestDto, NotificationResponseDto[]>,
        private readonly _serviceRequestProviderRepository: IServiceRequestProviderRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _addressRepository: IAddressRepository,
        private readonly _providerSelectionService: IProviderSelectionService
    ) {}

    async execute(dto: UpdateServiceRequestDto): Promise<ServiceRequestDetailsDto> {
        const existing = await this._serviceRequestRepository.findDetailsById(dto.id, dto.customerId);
        if (!existing) {
            throw new ApplicationError("NOT_FOUND", "Service request not found", "NOT_FOUND");
        }

        if (existing.status !== "PENDING" && existing.status !== "ACTIVE") {
            throw new ApplicationError(
                "EDIT_NOT_ALLOWED",
                `Requests cannot be edited in their current status (${existing.status})`,
                "VALIDATION"
            );
        }

        const quotationsReceived = (existing.quotations_count ?? 0) > 0;

        if (quotationsReceived) {
            if (dto.categoryId && dto.categoryId !== existing.category_id) {
                throw new ApplicationError(
                    "RESTRICTED_FIELD_UPDATE",
                    "Service category cannot be modified once quotations have been received",
                    "VALIDATION"
                );
            }

            if (dto.subserviceId !== undefined && dto.subserviceId !== existing.subservice_id) {
                throw new ApplicationError(
                    "RESTRICTED_FIELD_UPDATE",
                    "Subservice cannot be modified once quotations have been received",
                    "VALIDATION"
                );
            }

            if (dto.selectedAddressId && dto.selectedAddressId !== existing.address_id) {
                throw new ApplicationError(
                    "RESTRICTED_FIELD_UPDATE",
                    "Service location cannot be modified once quotations have been received",
                    "VALIDATION"
                );
            }
        }

        if (dto.imageUrls !== undefined && existing.images && existing.images.length > 0) {
            const retainedKeys = new Set(
                (dto.imageUrls ?? [])
                    .filter((url) => !url.startsWith("data:"))
                    .map((url) => StorageUtil.extractKey(url) ?? url)
            );
            const removedImages = existing.images.filter((img) => {
                const key = StorageUtil.extractKey(img.image_key) ?? img.image_key;
                return !retainedKeys.has(key);
            });
            for (const img of removedImages) {
                await this._imageUploadService.deleteImageByUrl(img.image_key);
            }
        }

        let processedImageUrls = dto.imageUrls;
        if (dto.imageUrls && dto.imageUrls.length > 0) {
            if (dto.imageUrls.length > 5) {
                throw new ApplicationError("VALIDATION", "Maximum 5 images allowed", "VALIDATION");
            }
            processedImageUrls = await Promise.all(
                dto.imageUrls.map(async (img) => {
                    if (img.startsWith("data:")) {
                        const base64Data = img.replace(/^data:image\/\w+;base64,/, "");
                        const buffer = Buffer.from(base64Data, "base64");
                        if (buffer.length > 10 * 1024 * 1024) {
                            throw new ApplicationError("VALIDATION", "Each image must not exceed 10MB", "VALIDATION");
                        }
                        return await this._imageUploadService.uploadImage(buffer, "service-requests");
                    }
                    return StorageUtil.extractKey(img) ?? img;
                })
            );
        }

        await this._serviceRequestRepository.update(dto.id, dto.customerId, {
            ...dto,
            imageUrls: processedImageUrls
        });

        const updated = await this._serviceRequestRepository.findDetailsById(dto.id, dto.customerId);
        if (!updated) {
            throw new ApplicationError("UPDATE_FAILED", "Failed to retrieve updated service request", "INTERNAL");
        }

        const providers = await this._userRepository.getActiveProviders();
        const profileToUserIdMap = new Map<string, string>();
        for (const p of providers) {
            if (p.provider_profile?.id) {
                profileToUserIdMap.set(p.provider_profile.id, p.id);
            }
        }

        let newMatchedProviderIds: string[] = [];
        if (dto.selectedAddressId || dto.subserviceId) {
            try {
                const effectiveAddressId = dto.selectedAddressId || updated.address_id;
                const effectiveSubserviceId = dto.subserviceId || updated.subservice_id;
                const customerAddress = await this._addressRepository.findById(effectiveAddressId);

                if (customerAddress && effectiveSubserviceId) {
                    const customerLat = Number(customerAddress.latitude);
                    const customerLng = Number(customerAddress.longitude);

                    newMatchedProviderIds = await this._providerSelectionService.getNearbyProviderIds({
                        providers,
                        customerId: dto.customerId,
                        customerLat,
                        customerLng,
                        subServiceId: effectiveSubserviceId
                    });

                    const matchedProviderProfileIds = providers
                        .filter((p) => newMatchedProviderIds.includes(p.id) && p.provider_profile?.id)
                        .map((p) => p.provider_profile!.id);

                    if (matchedProviderProfileIds.length > 0) {
                        await this._serviceRequestProviderRepository.createMany(
                            updated.id,
                            matchedProviderProfileIds
                        );
                    }
                }
            } catch (error) {
                logger.error(
                    { err: error, requestId: updated.id },
                    "Failed to remap nearby providers on update"
                );
            }
        }

        try {
            const matchedProviders = await this._serviceRequestProviderRepository.findByServiceRequestId(updated.id);
            const existingProviderUserIds = matchedProviders
                .map((p) => p.provider?.user_id || profileToUserIdMap.get(p.provider_id))
                .filter((uid): uid is string => Boolean(uid));

            const allProviderRecipientIds = Array.from(
                new Set([...newMatchedProviderIds, ...existingProviderUserIds])
            );

            if (allProviderRecipientIds.length > 0) {
                const bulkNotification: CreateBulkNotificationRequestDto = {
                    recipientIds: allProviderRecipientIds,
                    title: "Service Request Updated",
                    title_code: "SERVICE_REQUEST_UPDATED",
                    message: `${updated.title} was updated by the customer.`,
                    type: "INFO" as NotificationType
                };
                await this._createBulkNotificationUseCase.execute(bulkNotification);
            }
        } catch (error) {
            logger.error(
                { err: error, requestId: updated.id },
                "Failed to notify matched providers about updated service request"
            );
        }

        return updated;
    }
}
