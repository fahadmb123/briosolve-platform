export interface RequestQuotationProviderDto {
    id: string;
    userId: string;
    name: string;
    businessName: string;
    profileImage: string | null;
    experience: string;
    completedJobs: number;
    phone: string | null;
    email: string | null;
}

export interface RequestQuotationItemDto {
    id: string;
    serviceRequestId: string;
    providerId: string;
    provider: RequestQuotationProviderDto;
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
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface RequestQuotationsResponseDto {
    quotations: RequestQuotationItemDto[];
    total: number;
    acceptedQuotationId: string | null;
}
