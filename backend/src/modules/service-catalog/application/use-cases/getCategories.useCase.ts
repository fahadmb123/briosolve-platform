import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { Category } from "../../domain/entities/category.entity";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { GetCategoriesDto } from "../dtos/response/get-categories.dto";




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