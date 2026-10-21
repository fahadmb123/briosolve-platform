import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { AddCategoryUseCaseInputDto } from "../../application/dtos/request/add-category.dto";
import { UpdateCategoryUseCaseDto } from "../../application/dtos/request/update-category.dto";
import { GetCategoriesDto } from "../../application/dtos/response/get-categories.dto";
import { Category } from "../entities/category.entity";

export interface ICategoryRepository extends BaseRepository<Category | null>{
    findByName(name: string): Promise<Category | null>;
    get(input: GetCategoriesDto): Promise<{categories:Category[], total: number}> 
    add(input:AddCategoryUseCaseInputDto): Promise<Category | null>
    update(data:UpdateCategoryUseCaseDto): Promise<Category | null>
    delete(id: string): Promise<boolean>
}