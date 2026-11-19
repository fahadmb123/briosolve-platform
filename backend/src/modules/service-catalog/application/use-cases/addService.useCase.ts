import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { Service } from "../../domain/entities/service.entity";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { AddServiceUseCaseInputDto } from "../dtos/service/request/add-service.dto";
import { ServiceResponseDto } from "../dtos/service/response/service.dto";
import { ImageUploadService } from "../../../../shared/interfaces/services/IImageUpload.service";

export class AddServiceUseCase implements IUseCase<AddServiceUseCaseInputDto, ServiceResponseDto> {
    constructor(
        private readonly _serviceRepository: IServiceRepository,
        private readonly _imageUploadService: ImageUploadService,
        private readonly _categoryRepository: ICategoryRepository
    ) {}

    async execute(input: AddServiceUseCaseInputDto): Promise<ServiceResponseDto> {
        if (input.category_id) {
            const category = await this._categoryRepository.findById(input.category_id);
            if (!category) {
                throw new ApplicationError("NOT_FOUND", "Category not found", "NOT_FOUND");
            }
        }

        const normalizedName = input.name.trim().toLowerCase();
        const existingService = await this._serviceRepository.findByName(normalizedName);
        if (existingService) {
            throw new ApplicationError("CONFLICT", "Service with this name already exists", "CONFLICT");
        }

        input.name = normalizedName;

        if (input.imageBuffer) {
            input.image = await this._imageUploadService.uploadImage(input.imageBuffer, "services");
        }

        const service = await this._serviceRepository.add(input);
        if (!service) {
            throw new ApplicationError("INTERNAL_SERVER_ERROR", "Failed to add service", "INTERNAL");
        }
        return service;
    }
}
