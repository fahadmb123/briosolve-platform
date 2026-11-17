import { QuotationType, QuotationValidity } from "../../../domain/entities/quotation.entity";

export interface UpdateQuotationInputDto {
    providerUserId: string;
    quotationId: string;
    amount: number;
    quotationType: QuotationType;
    workDescription: string;
    includedItems: string[];
    excludedItems: string[];
    estimatedDuration?: string | null;
    availableDateTime?: string | null;
    validUntil: QuotationValidity;
    extraChargePolicy: string;
}

export interface UpdateQuotationRepoDto {
    amount: number;
    quotationType: QuotationType;
    workDescription: string;
    includedItems: string[];
    excludedItems: string[];
    estimatedDuration?: string | null;
    availableDateTime?: string | null;
    validUntil: QuotationValidity;
    extraChargePolicy: string;
}
