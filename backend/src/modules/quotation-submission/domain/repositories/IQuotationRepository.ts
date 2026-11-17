import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { Quotation } from "../entities/quotation.entity";
import { CreateQuotationRepoDto } from "../../application/dtos/request/submit-quotation.dto";

export interface IQuotationRepository extends BaseRepository<Quotation | null> {
    create(data: CreateQuotationRepoDto): Promise<Quotation | null>;
    findByRequestIdAndProviderId(serviceRequestId: string, providerId: string): Promise<Quotation | null>;
    findByServiceRequestId(serviceRequestId: string): Promise<Quotation[]>;
    findByProviderId(providerId: string, params: GetProviderQuotationsParams): Promise<ProviderQuotationsResult>;
}

export interface GetProviderQuotationsParams {
    page: number;
    limit: number;
    status?: string;
    sortBy?: "NEWEST" | "OLDEST";
}

export interface ProviderQuotationsResult {
    quotations: Quotation[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
    counts: Record<string, number>;
}
