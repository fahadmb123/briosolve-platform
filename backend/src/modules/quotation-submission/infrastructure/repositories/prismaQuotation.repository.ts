import { db } from "../../../../shared/database/client";
import { Quotation } from "../../domain/entities/quotation.entity";
import { IQuotationRepository, GetProviderQuotationsParams, ProviderQuotationsResult } from "../../domain/repositories/IQuotationRepository";
import { CreateQuotationRepoDto } from "../../application/dtos/request/submit-quotation.dto";
import { UpdateQuotationRepoDto } from "../../application/dtos/request/update-quotation.dto";
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

    async update(id: string, data: UpdateQuotationRepoDto): Promise<Quotation | null> {
        const persistence = QuotationMapper.toUpdatePersistence(data);
        const updated = await db.orm.public.quotations
            .where({ id: id as never })
            .update(persistence as never);

        if (!updated) return null;
        return QuotationMapper.toDomain(updated);
    }

    async findByProviderId(providerId: string, params: GetProviderQuotationsParams): Promise<ProviderQuotationsResult> {
        const { page, limit, status, sortBy } = params;

        const whereClause: Record<string, any> = { provider_id: providerId as never };
        if (status && status !== "ALL") {
            whereClause.status = status as never;
        }

        const allRecords = await db.orm.public.quotations
            .where(whereClause)
            .all();

        const statusList = ["PENDING", "ACCEPTED", "REJECTED", "EXPIRED", "WITHDRAWN"];
        const counts: Record<string, number> = { ALL: allRecords.length };
        for (const s of statusList) {
            counts[s] = allRecords.filter((r: any) => r.status === s).length;
        }

        const sorted = [...allRecords].sort((a: any, b: any) => {
            const aTime = a.created_at ? Number(a.created_at.epochMilliseconds ?? new Date(a.created_at).getTime()) : 0;
            const bTime = b.created_at ? Number(b.created_at.epochMilliseconds ?? new Date(b.created_at).getTime()) : 0;
            return sortBy === "OLDEST" ? aTime - bTime : bTime - aTime;
        });

        const total = sorted.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const offset = (page - 1) * limit;
        const paginated = sorted.slice(offset, offset + limit);

        return {
            quotations: paginated.map((r: any) => QuotationMapper.toDomain(r)),
            total,
            totalPages,
            page,
            limit,
            counts
        };
    }
}
