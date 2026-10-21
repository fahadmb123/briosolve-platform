import type { AddCategoryUseCaseInputDto } from "./add-category.dto"


export type UpdateCategoryDto = Partial<AddCategoryUseCaseInputDto>
export type UpdateCategoryUseCaseDto = {
    id:string,
    input:UpdateCategoryDto
}