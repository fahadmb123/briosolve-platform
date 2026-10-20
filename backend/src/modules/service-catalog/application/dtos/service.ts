export interface GetServicesDto {
    page: number;
    limit: number;
    search?: string;
    filter?: string;
}

export interface AddServiceUseCaseInputDto {
    name: string;
    category_id: string;
    description: string;
    image: string | null;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateServiceUseCaseDto {
    id: string;
    input: {
        name?: string;
        category_id?: string;
        description?: string;
        image?: string | null;
        status?: 'ACTIVE' | 'INACTIVE';
    }
}
