export type GetCategoriesDto = {
    page: number;
    limit: number;
    filter?: string;
    search?: string;
}