import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { ImageUploadService } from "../../../../shared/domain/interfaces/IImageUpload.service.js";

export class DeleteServiceUseCase implements IUseCase<string, boolean> {
    constructor(
        private serviceRepository: IServiceRepository,
        private readonly imageUploadService: ImageUploadService
    ){}

    async execute(id: string): Promise<boolean> {
        const existingService = await this.serviceRepository.findById(id);
        if (!existingService) {
            throw new ApplicationError("NOT_FOUND", "Service not found", "NOT_FOUND");
        }
        if (existingService.image) {
            await this.imageUploadService.deleteImageByUrl(existingService.image);
        }
        return await this.serviceRepository.delete(id);
    }
}
