import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { Quotation } from "../entities/quotation.entity";
import { CreateQuotationRepoDto } from "../../application/dtos/request/submit-quotation.dto";

export interface IQuotationRepository extends BaseRepository<Quotation | null> {
    create(data: CreateQuotationRepoDto): Promise<Quotation | null>;
    findByRequestIdAndProviderId(serviceRequestId: string, providerId: string): Promise<Quotation | null>;
    findByServiceRequestId(serviceRequestId: string): Promise<Quotation[]>;
}
