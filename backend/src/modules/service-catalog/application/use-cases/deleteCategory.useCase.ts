import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository.js";
import { ImageUploadService } from "../../../../shared/domain/interfaces/IImageUpload.service.js";

export class DeleteCategoryUseCase implements IUseCase<string, boolean> {
    constructor(
        private readonly categoryRepository: ICategoryRepository,
        private readonly imageUploadService: ImageUploadService
    ) {}

    async execute(id: string): Promise<boolean> {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new ApplicationError("NOT_FOUND", "Category not found", "NOT_FOUND");
        }
        if (category.image) {
            await this.imageUploadService.deleteImageByUrl(category.image);
        }

        return await this.categoryRepository.delete(id);
    }
}
