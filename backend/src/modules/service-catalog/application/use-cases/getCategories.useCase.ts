import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { Category } from "../../domain/entities/category.entity.js";
import { GetCategoriesDto } from "../Dto/category.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository.js";




export class GetCategoriesUseCase implements IUseCase<GetCategoriesDto,{categories:Category[], total: number, totalPages: number}>{
    constructor(
        private readonly categoryRepository : ICategoryRepository
    ){}
    async execute(input: GetCategoriesDto): Promise<{categories:Category[], total: number, totalPages: number}> {
        const response = await this.categoryRepository.get(input)

        if (!response.categories) throw new ApplicationError("FAILED","failed","INTERNAL")
            
        const totalPages = Math.ceil(response.total / input.limit);
        
        return {
            categories: response.categories,
            total: response.total,
            totalPages
        }
    }
}