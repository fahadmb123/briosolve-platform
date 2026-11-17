import { QuotationType, QuotationValidity } from "../../../domain/entities/quotation.entity";

export interface SubmitQuotationInputDto {
    providerUserId: string;
    serviceRequestId: string;
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

export interface CreateQuotationRepoDto {
    serviceRequestId: string;
    providerId: string;
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
