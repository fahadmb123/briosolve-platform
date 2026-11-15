import { ApplicationError } from "../../../../shared/errors/applicationError";
import { Category } from "../../domain/entities/category.entity";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { UpdateCategoryUseCaseDto } from "../dtos/category/request/update-category.dto";
import { CategoryResponseDto } from "../dtos/category/response/category.dto";
import { ImageUploadService } from "../../../../shared/interfaces/services/IImageUpload.service";

export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryUseCaseDto, CategoryResponseDto> {
    constructor(
        private readonly _categoryRepository: ICategoryRepository,
        private readonly _imageUploadService: ImageUploadService,
    ) {}

    async execute(data: UpdateCategoryUseCaseDto): Promise<CategoryResponseDto> {
        const existingCategory = await this._categoryRepository.findById(data.id);
        if (!existingCategory) {
            throw new ApplicationError("NOT_FOUND", "Category not found", "NOT_FOUND");
        }

        if (data.input.name) {
            data.input.name = data.input.name.trim().toLowerCase();
            const isExist = await this._categoryRepository.findByName(data.input.name);
            if (isExist && String(isExist.id) !== String(data.id)) {
                throw new ApplicationError("NAME_ALREADY_EXIST", "Category with this name already exists", "CONFLICT");
            }
        }

        if (data.imageBuffer) {
            if (existingCategory.image) {
                await this._imageUploadService.deleteImageByUrl(existingCategory.image);
            }
            const imageUrl = await this._imageUploadService.uploadImage(data.imageBuffer, "categories");
            data.input.image = imageUrl;
        } else if (data.input.image && data.input.image !== existingCategory.image && existingCategory.image) {
            await this._imageUploadService.deleteImageByUrl(existingCategory.image);
        }

        const category = await this._categoryRepository.update(data);
        if (!category) {
            throw new ApplicationError("FAILED", "Failed to update category", "INTERNAL");
        }

        return category;
    }
}
