export type GetReactivationsDto = {
    page: number;
    limit: number;
    search?: string;
    filter?: string;
    role?: string;
    sort?: "asc" | "desc";
};
