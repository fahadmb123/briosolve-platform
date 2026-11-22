export interface QuotationResponseDto {
    id: string;
    serviceRequestId: string;
    providerId: string;
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
