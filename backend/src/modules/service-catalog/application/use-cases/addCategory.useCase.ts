import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { Category } from "../../domain/entities/category.entity";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { AddCategoryUseCaseInputDto } from "../dtos/request/add-category.dto";





export class AddCategoryUseCase implements IUseCase<AddCategoryUseCaseInputDto,Category>{
    constructor(
        private readonly categoryRepository : ICategoryRepository
    ){}
    async execute(input: AddCategoryUseCaseInputDto): Promise<Category> {
        const isName  = await this.categoryRepository.findByName(input.name)

        if (isName) throw new ApplicationError("NAME_ALREADY_EXIST","name already exist","CONFLICT")

        const category = await this.categoryRepository.add(input)

        if (!category) throw new ApplicationError("FAILED","failed","INTERNAL")
            
        return category
    }
}