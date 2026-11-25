export interface QuotationRankingItem {
    quotationId: string;
    providerName: string;
    rank: number;
    score: number;
    pros: string[];
    cons: string[];
    verdict: string;
}

export interface CompareQuotationsResponseDto {
    recommendedWinnerId: string;
    rankings: QuotationRankingItem[];
    aiSummary: string;
}
