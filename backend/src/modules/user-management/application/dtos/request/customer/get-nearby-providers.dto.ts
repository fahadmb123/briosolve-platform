export type GetNearbyProvidersDto = {
    userId: string;
    page?: number;
    limit?: number;
    search?: string;
    radius?: number;
};
