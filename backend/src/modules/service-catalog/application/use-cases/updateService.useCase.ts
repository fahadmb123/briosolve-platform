import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { Service } from "../../domain/entities/service.entity";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { ImageUploadService } from "../../../../shared/interfaces/services/IImageUpload.service";
import { UpdateServiceUseCaseDto } from "../dtos/service/request/update-service.dto";
import { ServiceResponseDto } from "../dtos/service/response/service.dto";

export class UpdateServiceUseCase implements IUseCase<UpdateServiceUseCaseDto, ServiceResponseDto> {
    constructor(
        private readonly _serviceRepository: IServiceRepository,
        private readonly _imageUploadService: ImageUploadService,
        private readonly _categoryRepository?: ICategoryRepository
    ) {}

    async execute(input: UpdateServiceUseCaseDto): Promise<ServiceResponseDto> {
        const existingService = await this._serviceRepository.findById(input.id);
        if (!existingService) {
            throw new ApplicationError("NOT_FOUND", "Service not found", "NOT_FOUND");
        }

        if (this._categoryRepository && input.input.category_id) {
            const category = await this._categoryRepository.findById(input.input.category_id);
            if (!category) {
                throw new ApplicationError("NOT_FOUND", "Category not found", "NOT_FOUND");
            }
        }

        if (input.input.name) {
            input.input.name = input.input.name.trim().toLowerCase();
            const serviceWithName = await this._serviceRepository.findByName(input.input.name);
            if (serviceWithName && String(serviceWithName.id) !== String(input.id)) {
                throw new ApplicationError("CONFLICT", "Service with this name already exists", "CONFLICT");
            }
        }

        if (input.imageBuffer) {
            const imageUrl = await this._imageUploadService.uploadImage(input.imageBuffer, "services");
            if (existingService.image) {
                await this._imageUploadService.deleteImageByUrl(existingService.image);
            }
            input.input.image = imageUrl;
        } else if (input.input.image && input.input.image !== existingService.image && existingService.image) {
            await this._imageUploadService.deleteImageByUrl(existingService.image);
        }

        const service = await this._serviceRepository.update(input);
        if (!service) {
            throw new ApplicationError("INTERNAL_SERVER_ERROR", "Failed to update service", "INTERNAL");
        }
        return service;
    }
}
