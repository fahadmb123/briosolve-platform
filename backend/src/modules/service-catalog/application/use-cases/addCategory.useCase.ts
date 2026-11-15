import { ApplicationError } from "../../../../shared/errors/applicationError";
import { Category } from "../../domain/entities/category.entity";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { AddCategoryUseCaseInputDto } from "../dtos/category/request/add-category.dto";
import { CategoryResponseDto } from "../dtos/category/response/category.dto";
import { ImageUploadService } from "../../../../shared/interfaces/services/IImageUpload.service";

export class AddCategoryUseCase implements IUseCase<AddCategoryUseCaseInputDto, CategoryResponseDto> {
    constructor(
        private readonly _categoryRepository: ICategoryRepository,
        private readonly _imageUploadService: ImageUploadService
    ) {}

    async execute(input: AddCategoryUseCaseInputDto): Promise<CategoryResponseDto> {
        const normalizedName = input.name.trim().toLowerCase();
        const isName = await this._categoryRepository.findByName(normalizedName);

        if (isName) {
            throw new ApplicationError("NAME_ALREADY_EXIST", "Category with this name already exists", "CONFLICT");
        }

        input.name = normalizedName;

        if (input.imageBuffer) {
            input.image = await this._imageUploadService.uploadImage(input.imageBuffer, "categories");
        }

        const category = await this._categoryRepository.add(input);

        if (!category) {
            throw new ApplicationError("FAILED", "Failed to add category", "INTERNAL");
        }

        return category;
    }
}
