import { db } from "../../../../shared/database/client";
import { Quotation } from "../../domain/entities/quotation.entity";
import { IQuotationRepository } from "../../domain/repositories/IQuotationRepository";
import { CreateQuotationRepoDto } from "../../application/dtos/request/submit-quotation.dto";
import { QuotationMapper } from "../mappers/quotation.mapper";

export class PrismaQuotationRepository implements IQuotationRepository {
    async findById(id: string): Promise<Quotation | null> {
        const record = await db.orm.public.quotations
            .where({ id: id as never })
            .first();

        if (!record) return null;
        return QuotationMapper.toDomain(record);
    }

    async findByRequestIdAndProviderId(
        serviceRequestId: string,
        providerId: string
    ): Promise<Quotation | null> {
        const record = await db.orm.public.quotations
            .where({
                service_request_id: serviceRequestId as never,
                provider_id: providerId as never
            })
            .first();

        if (!record) return null;
        return QuotationMapper.toDomain(record);
    }

    async findByServiceRequestId(serviceRequestId: string): Promise<Quotation[]> {
        const records = await db.orm.public.quotations
            .where({ service_request_id: serviceRequestId as never })
            .all();

        return records.map((r: any) => QuotationMapper.toDomain(r));
    }

    async create(data: CreateQuotationRepoDto): Promise<Quotation | null> {
        const persistence = QuotationMapper.toPersistence(data);
        const created = await db.orm.public.quotations.create(persistence as never);

        if (!created) return null;
        return QuotationMapper.toDomain(created);
    }
}
