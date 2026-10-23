import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { Service } from "../../domain/entities/service.entity";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";
import { UpdateServiceUseCaseDto } from "../dtos/service/request/update-service.dto";
import { ServiceResponseDto } from "../dtos/service/response/service.dto";

export class UpdateServiceUseCase implements IUseCase<UpdateServiceUseCaseDto, ServiceResponseDto> {
    constructor(
        private readonly _serviceRepository: IServiceRepository,
        private readonly _imageUploadService: ImageUploadService
    ){}

    async execute(input: UpdateServiceUseCaseDto): Promise<ServiceResponseDto> {
        const existingService = await this._serviceRepository.findById(input.id);
        if (!existingService) {
            throw new ApplicationError("NOT_FOUND", "Service not found", "NOT_FOUND");
        }
        
        if (input.input.image && existingService.image) {
            await this._imageUploadService.deleteImageByUrl(existingService.image);
        }

        const service = await this._serviceRepository.update(input);
        if (!service) {
            throw new ApplicationError("INTERNAL_SERVER_ERROR", "Failed to update service", "INTERNAL");
        }
        return service;
    }
}
