import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";

export class DeleteServiceUseCase implements IUseCase<string, boolean> {
    constructor(
        private readonly _serviceRepository: IServiceRepository,
        private readonly _imageUploadService: ImageUploadService
    ){}

    async execute(id: string): Promise<boolean> {
        const existingService = await this._serviceRepository.findById(id);
        if (!existingService) {
            throw new ApplicationError("NOT_FOUND", "Service not found", "NOT_FOUND");
        }
        if (existingService.image) {
            await this._imageUploadService.deleteImageByUrl(existingService.image);
        }
        return await this._serviceRepository.delete(id);
    }
}
