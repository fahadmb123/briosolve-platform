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
