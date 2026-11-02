import { Buffer } from "node:buffer";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { CreateServiceRequestInputDto } from "../dtos/request/create-service-request.dto";
import { ServiceRequestResponseDto } from "../dtos/response/service-request.dto";
import { ServiceRequestMapper } from "../../infrastructure/mappers/serviceRequest.mapper";

export class CreateServiceRequestUseCase implements IUseCase<CreateServiceRequestInputDto, ServiceRequestResponseDto> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _imageUploadService: ImageUploadService
    ) {}

    async execute(input: CreateServiceRequestInputDto): Promise<ServiceRequestResponseDto> {
        if (!input.customerId) throw new ApplicationError("UNAUTHORIZED", "Customer ID is required", "AUTHENTICATION")

        if (!input.images || input.images.length === 0) throw new ApplicationError("VALIDATION", "At least one image is required", "VALIDATION")

        const imageUrls = await Promise.all(
            input.images.map(async (img) => {
                if (img.startsWith("data:")) {
                    const base64Data = img.replace(/^data:image\/\w+;base64,/, "");
                    const buffer = Buffer.from(base64Data, "base64");
                    return await this._imageUploadService.uploadImage(buffer, "service-requests");
                }
                return img;
            })
        );

        const serviceRequest = await this._serviceRequestRepository.create({
            ...input,
            imageUrls
        });

        if (!serviceRequest) throw new ApplicationError("FAILED", "Failed to create service request", "INTERNAL")

        return ServiceRequestMapper.toDto(serviceRequest)
    }
}

