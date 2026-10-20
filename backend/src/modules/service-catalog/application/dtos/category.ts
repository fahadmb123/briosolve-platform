export type AddCategoryUseCaseInputDto = {
    name:string,
    description:string,
    status:string
    image:string,
}

export type UpdateCategoryUseCaseDto = {
    id:string,
    input:UpdateCategoryDto
}
export type UpdateCategoryDto = Partial<AddCategoryUseCaseInputDto>

export type GetCategoriesDto = {
    page: number;
    limit: number;
    filter?: string;
    search?: string;
}