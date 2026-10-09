import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository.js";

export class DeleteCategoryUseCase implements IUseCase<string, boolean> {
    constructor(private readonly categoryRepository: ICategoryRepository) {}

    async execute(id: string): Promise<boolean> {
        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new ApplicationError("NOT_FOUND", "Category not found", "NOT_FOUND");
        }

        return await this.categoryRepository.delete(id);
    }
}
