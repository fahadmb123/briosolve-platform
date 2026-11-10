import { Buffer } from "node:buffer";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ImageUploadService } from "../../../../shared/interfaces/services/IImageUpload.service";
import { UpdateServiceRequestDto } from "../dtos/request/update-service-request.dto";
import { ServiceRequestDetailsDto } from "../dtos/response/service-request.dto";

export class UpdateServiceRequestUseCase implements IUseCase<UpdateServiceRequestDto, ServiceRequestDetailsDto> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _imageUploadService: ImageUploadService
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
                    return img;
                })
            );
        }

        if (dto.imageUrls !== undefined && existing.images && existing.images.length > 0) {
            const retainedUrls = new Set(
                (processedImageUrls ?? []).filter((url) => !url.startsWith("data:"))
            );
            const removedImages = existing.images.filter((img) => !retainedUrls.has(img.image_key));
            for (const img of removedImages) {
                await this._imageUploadService.deleteImageByUrl(img.image_key);
            }
        }

        await this._serviceRequestRepository.update(dto.id, dto.customerId, {
            ...dto,
            imageUrls: processedImageUrls
        });

        const updated = await this._serviceRequestRepository.findDetailsById(dto.id, dto.customerId);
        if (!updated) {
            throw new ApplicationError("UPDATE_FAILED", "Failed to retrieve updated service request", "INTERNAL");
        }

        return updated;
    }
}
