export interface ProviderQuotationItemDto {
    id: string;
    serviceRequestId: string;
    serviceRequestTitle?: string | null;
    categoryName?: string | null;
    amount: number;
    quotationType: string;
    workDescription: string;
    includedItems: string[];
    excludedItems: string[];
    estimatedDuration: string | null;
    availableDateTime: string | null;
    validUntil: string;
    validUntilDate: string;
    extraChargePolicy: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProviderQuotationsResponseDto {
    quotations: ProviderQuotationItemDto[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
    counts: Record<string, number>;
}
