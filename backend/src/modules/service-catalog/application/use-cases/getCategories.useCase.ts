import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { Category } from "../../domain/entities/category.entity.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository.js";




export class UpdateCategoryUseCase implements IUseCase<void,{categories:Category[]}>{
    constructor(
        private readonly categoryRepository : ICategoryRepository
    ){}
    async execute(): Promise<{categories:Category[]}> {
        const response = await this.categoryRepository.get()

        if (!response.categories) throw new ApplicationError("FAILED","failed","INTERNAL")
            
        return response
    }
}