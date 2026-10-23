import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";

export class DeleteCategoryUseCase implements IUseCase<string, boolean> {
    constructor(
        private readonly _categoryRepository: ICategoryRepository,
        private readonly _imageUploadService: ImageUploadService
    ) {}

    async execute(id: string): Promise<boolean> {
        const category = await this._categoryRepository.findById(id);
        if (!category) {
            throw new ApplicationError("NOT_FOUND", "Category not found", "NOT_FOUND");
        }
        if (category.image) {
            await this._imageUploadService.deleteImageByUrl(category.image);
        }

        return await this._categoryRepository.delete(id);
    }
}
