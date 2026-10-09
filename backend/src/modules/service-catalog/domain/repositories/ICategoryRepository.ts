import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { AddCategoryUseCaseInputDto, UpdateCategoryUseCaseDto } from "../../application/Dto/category.js";
import { Category } from "../entities/category.entity.js";

export interface ICategoryRepository extends BaseRepository<Category | null>{
    findById(id: string): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    get(): Promise<{categories:Category[]}> 
    add(input:AddCategoryUseCaseInputDto): Promise<Category | null>
    update(data:UpdateCategoryUseCaseDto): Promise<Category | null>
}