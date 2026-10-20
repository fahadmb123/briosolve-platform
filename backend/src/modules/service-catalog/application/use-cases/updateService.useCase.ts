import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { UpdateServiceUseCaseDto } from "../dtos/service";
import { Service } from "../../domain/entities/service.entity";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";

export class UpdateServiceUseCase implements IUseCase<UpdateServiceUseCaseDto, Service> {
    constructor(
        private serviceRepository: IServiceRepository,
        private readonly imageUploadService: ImageUploadService
    ){}

    async execute(input: UpdateServiceUseCaseDto): Promise<Service> {
        const existingService = await this.serviceRepository.findById(input.id);
        if (!existingService) {
            throw new ApplicationError("NOT_FOUND", "Service not found", "NOT_FOUND");
        }
        
        if (input.input.image && existingService.image) {
            await this.imageUploadService.deleteImageByUrl(existingService.image);
        }

        const service = await this.serviceRepository.update(input);
        if (!service) {
            throw new ApplicationError("INTERNAL_SERVER_ERROR", "Failed to update service", "INTERNAL");
        }
        return service;
    }
}
