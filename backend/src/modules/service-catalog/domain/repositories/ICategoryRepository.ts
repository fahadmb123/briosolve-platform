import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { AddCategoryUseCaseInputDto, UpdateCategoryUseCaseDto, GetCategoriesDto } from "../../application/Dto/category.js";
import { Category } from "../entities/category.entity.js";

export interface ICategoryRepository extends BaseRepository<Category | null>{
    findByName(name: string): Promise<Category | null>;
    get(input: GetCategoriesDto): Promise<{categories:Category[], total: number}> 
    add(input:AddCategoryUseCaseInputDto): Promise<Category | null>
    update(data:UpdateCategoryUseCaseDto): Promise<Category | null>
    delete(id: string): Promise<boolean>
}