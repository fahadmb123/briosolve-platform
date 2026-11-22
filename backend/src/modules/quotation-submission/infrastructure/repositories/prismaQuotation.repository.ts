import { db } from "../../../../shared/database/client";
import { Quotation } from "../../domain/entities/quotation.entity";
import { IQuotationRepository, GetProviderQuotationsParams, ProviderQuotationsResult } from "../../domain/repositories/IQuotationRepository";
import { CreateQuotationRepoDto } from "../../application/dtos/request/submit-quotation.dto";
import { UpdateQuotationRepoDto } from "../../application/dtos/request/update-quotation.dto";
import { QuotationMapper } from "../mappers/quotation.mapper";

export class PrismaQuotationRepository implements IQuotationRepository {
    private async syncExpiredQuotations(): Promise<void> {
        try {
            const now = new Date();
            const pendingRecords = await db.orm.public.quotations
                .where({ status: "PENDING" as never })
                .all();

            const expiredIds: string[] = [];
            for (const record of pendingRecords) {
                if (!record.valid_until_date) continue;
                const rawDate: any = record.valid_until_date;
                const dateVal = rawDate?.epochMilliseconds
                    ? new Date(Number(rawDate.epochMilliseconds))
                    : new Date(rawDate);

                if (!isNaN(dateVal.getTime()) && now.getTime() > dateVal.getTime()) {
                    expiredIds.push(record.id);
                }
            }

            if (expiredIds.length > 0) {
                await db.orm.public.quotations
                    .where((q) => q.id.in(expiredIds))
                    .updateAll({
                        status: "EXPIRED" as never,
                        rejection_reason: "Quotation validity expired" as never
                    } as never);
            }
        } catch {
            return;
        }
    }

    async findById(id: string): Promise<Quotation | null> {
        await this.syncExpiredQuotations();
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
        await this.syncExpiredQuotations();
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
        await this.syncExpiredQuotations();
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
        await this.syncExpiredQuotations();
        const { page, limit, status, sortBy } = params;

        let query = db.orm.public.quotations.where({ provider_id: providerId as never });

        if (status && status !== "ALL") {
            query = query.where({ status: status as never });
        }

        if (sortBy === "OLDEST") {
            query = query.orderBy((q) => q.created_at.asc());
        } else {
            query = query.orderBy((q) => q.created_at.desc());
        }

        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));
        const offset = (page - 1) * limit;
        const paginated = await query.offset(offset).limit(limit).all();

        const statusRows = await db.orm.public.quotations
            .where({ provider_id: providerId as never })
            .select("status")
            .all();

        const statusList = ["PENDING", "ACCEPTED", "REJECTED", "EXPIRED", "WITHDRAWN"];
        const counts: Record<string, number> = { ALL: statusRows.length };
        for (const s of statusList) {
            counts[s] = statusRows.filter((r: any) => r.status === s).length;
        }

        const total = totalResult.total;
        const totalPages = Math.ceil(total / limit) || 1;

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
