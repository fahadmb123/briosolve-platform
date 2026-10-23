import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { Category } from "../../domain/entities/category.entity";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { AddCategoryUseCaseInputDto } from "../dtos/category/request/add-category.dto";
import { CategoryResponseDto } from "../dtos/category/response/category.dto";





export class AddCategoryUseCase implements IUseCase<AddCategoryUseCaseInputDto,CategoryResponseDto>{
    constructor(
        private readonly _categoryRepository : ICategoryRepository
    ){}
    async execute(input: AddCategoryUseCaseInputDto): Promise<CategoryResponseDto> {
        const isName  = await this._categoryRepository.findByName(input.name)

        if (isName) throw new ApplicationError("NAME_ALREADY_EXIST","name already exist","CONFLICT")

        const category = await this._categoryRepository.add(input)

        if (!category) throw new ApplicationError("FAILED","failed","INTERNAL")
            
        return category
    }
}