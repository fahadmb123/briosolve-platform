import { IUseCase } from "../../../../shared/domain/interfaces/use-cases/IUseCase";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ImageUploadService } from "../../../../shared/domain/interfaces/services/IImageUpload.service";

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
