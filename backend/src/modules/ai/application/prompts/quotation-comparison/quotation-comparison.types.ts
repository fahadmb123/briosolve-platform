export interface QuotationComparisonBidProvider {
    id: string;
    businessName: string;
    name: string;
    experience: string;
    completedJobs: number;
}

export interface QuotationComparisonBidPayload {
    quotationId: string;
    amount: number;
    quotationType: string;
    workDescription: string;
    includedItems: string[];
    excludedItems: string[];
    estimatedDuration: string | null;
    availableDateTime: string | null;
    extraChargePolicy: string;
    status: string;
    provider: QuotationComparisonBidProvider;
}
