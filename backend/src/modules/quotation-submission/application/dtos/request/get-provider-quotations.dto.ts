export interface GetProviderQuotationsInputDto {
    providerUserId: string;
    page: number;
    limit: number;
    status?: string;
    sortBy?: "NEWEST" | "OLDEST";
}
