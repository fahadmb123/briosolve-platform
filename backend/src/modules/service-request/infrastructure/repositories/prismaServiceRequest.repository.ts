import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/database/client";
import { ServiceRequest } from "../../domain/entities/serviceRequest.entity";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";
import { UpdateServiceRequestRepoDto } from "../../application/dtos/request/update-service-request.dto";
import {
    ServiceRequestDetailsDto,
    GetCustomerRequestsOutputDto,
    GetAdminServiceRequestsInputDto
} from "../../application/dtos/response/service-request.dto";
import { GetCustomerServiceRequestsInputDto } from "../../application/use-cases/getCustomerServiceRequests.useCase";
import { ServiceRequestMapper } from "../mappers/serviceRequest.mapper";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class ServiceRequestRepository implements IServiceRequestRepository {
    private async syncExpiredRequests(): Promise<void> {
        try {
            const endOfToday = new Date();
            endOfToday.setHours(23, 59, 59, 999);
            const endOfTodayInstant = Temporal.Instant.fromEpochMilliseconds(endOfToday.getTime());

            const records = await db.orm.public.service_requests
                .where((req) => req.status.in(["PENDING", "ACTIVE"]))
                .where((req) => req.specific_date.isNotNull())
                .where((req) => req.specific_date.lte(endOfTodayInstant as never))
                .all();

            if (records.length === 0) return;

            const now = new Date();
            const expiredIds: string[] = [];

            for (const req of records) {
                const rawDate: any = req.specific_date;
                const dateVal = rawDate?.epochMilliseconds
                    ? new Date(Number(rawDate.epochMilliseconds))
                    : new Date(rawDate);

                if (isNaN(dateVal.getTime())) continue;

                let timeStr = "23:59:59";
                if (req.available_time_to) {
                    timeStr = req.available_time_to.toString();
                    if (timeStr.length === 5) {
                        timeStr = `${timeStr}:00`;
                    }
                }

                const [hours, minutes] = timeStr.split(":").map(Number);
                const deadline = new Date(dateVal);
                deadline.setHours(
                    hours !== undefined && !isNaN(hours) ? hours : 23,
                    minutes !== undefined && !isNaN(minutes) ? minutes : 59,
                    59,
                    999
                );

                if (now.getTime() > deadline.getTime()) {
                    expiredIds.push(req.id);
                }
            }

            if (expiredIds.length === 0) return;

            await db.orm.public.service_requests
                .where((req) => req.id.in(expiredIds))
                .updateAll({
                    status: "EXPIRED" as never,
                    updated_at: Temporal.Now.instant()
                } as never);

            await db.orm.public.service_request_providers
                .where((p) => p.service_request_id.in(expiredIds))
                .deleteAll();
        } catch {
            return;
        }
    }

    async findById(id: string): Promise<ServiceRequest | null> {
        await this.syncExpiredRequests();
        const record = await db.orm.public.service_requests
            .where({ id: id as never })
            .include("images")
            .first();

        if (!record) return null;
        return ServiceRequestMapper.toDomain(record);
    }

    async findDetailsById(id: string, customerId: string): Promise<ServiceRequestDetailsDto | null> {
        await this.syncExpiredRequests();
        const record = await db.orm.public.service_requests
            .where({ id: id as never, customer_id: customerId as never })
            .include("images")
            .include("category")
            .include("subservice")
            .include("address")
            .include("customer", (c) => c.include("customer_profile"))
            .include("providers")
            .first();

        if (!record) return null;
        return ServiceRequestMapper.toDetailsDto(record);
    }

    async findByCustomerId(
        input: GetCustomerServiceRequestsInputDto
    ): Promise<{ requests: ServiceRequestDetailsDto[]; total: number; counts: Record<string, number> }> {
        await this.syncExpiredRequests();
        const { customerId, page = 1, limit = 10, search, status, sortBy = "NEWEST" } = input;
        const skip = (page - 1) * limit;

        let query = db.orm.public.service_requests.where({ customer_id: customerId as never });

        if (status && status !== "ALL") {
            query = query.where({ status: status as never });
        }

        if (search && search.trim()) {
            query = query.where((req) => req.title.ilike(`%${search.trim()}%`));
        }

        if (sortBy === "OLDEST") {
            query = query.orderBy((req) => req.updated_at.asc());
        } else {
            query = query.orderBy((req) => req.updated_at.desc());
        }

        const records = await query
            .include("images")
            .include("category")
            .include("subservice")
            .include("address")
            .include("customer", (c) => c.include("customer_profile"))
            .include("providers")
            .offset(skip)
            .limit(limit)
            .all();

        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));

        const allRecords = await db.orm.public.service_requests
            .where({ customer_id: customerId as never })
            .all();

        const counts: Record<string, number> = {
            ALL: allRecords.length,
            DRAFT: 0,
            PENDING: 0,
            ACTIVE: 0,
            ACCEPTED: 0,
            IN_PROGRESS: 0,
            COMPLETED: 0,
            CANCELLED: 0,
            EXPIRED: 0
        };

        allRecords.forEach((r) => {
            if (r.status in counts) {
                counts[r.status] += 1;
            }
        });

        return {
            requests: records.map((record) => ServiceRequestMapper.toDetailsDto(record)),
            total: totalResult.total,
            counts
        };
    }

    async update(id: string, customerId: string, data: UpdateServiceRequestRepoDto): Promise<ServiceRequest | null> {
        return await db.transaction(async (tx) => {
            const updatePayload = ServiceRequestMapper.toUpdatePersistence(data);

            await tx.orm.public.service_requests
                .where({ id: id as never, customer_id: customerId as never })
                .update(updatePayload as never);

            if (data.imageUrls !== undefined) {
                await tx.orm.public.service_request_images
                    .where({ service_request_id: id as never })
                    .delete();

                if (data.imageUrls.length > 0) {
                    for (let i = 0; i < data.imageUrls.length; i++) {
                        const imageData = ServiceRequestMapper.toImagePersistence(id, data.imageUrls[i], i);
                        await tx.orm.public.service_request_images.create(imageData as never);
                    }
                }
            }

            const record = await tx.orm.public.service_requests
                .where({ id: id as never })
                .include("images")
                .first();

            if (!record) return null;
            return ServiceRequestMapper.toDomain(record);
        });
    }

    async cancel(id: string, customerId: string): Promise<ServiceRequest | null> {
        const existing = await db.orm.public.service_requests
            .where({ id: id as never, customer_id: customerId as never })
            .first();

        if (!existing) return null;

        if (existing.status !== "PENDING" && existing.status !== "ACTIVE") {
            throw new ApplicationError("INVALID_STATE", "Only pending or open requests can be cancelled", "VALIDATION");
        }

        const updated = await db.orm.public.service_requests
            .where({ id: id as never })
            .update({
                status: "CANCELLED" as never,
                updated_at: Temporal.Now.instant()
            });

        if (!updated) return null;

        const record = await db.orm.public.service_requests
            .where({ id: id as never })
            .include("images")
            .first();

        if (!record) return null;
        return ServiceRequestMapper.toDomain(record);
    }

    async create(data: CreateServiceRequestRepoDto): Promise<ServiceRequest | null> {
        return await db.transaction(async (tx) => {
            const persistenceData = ServiceRequestMapper.toPersistence(data);
            const created = await tx.orm.public.service_requests.create(persistenceData as never);

            if (!created) return null;

            const recordId = (created as { id: string }).id;

            if (data.imageUrls && data.imageUrls.length > 0) {
                for (let i = 0; i < data.imageUrls.length; i++) {
                    const imageData = ServiceRequestMapper.toImagePersistence(recordId, data.imageUrls[i], i);
                    await tx.orm.public.service_request_images.create(imageData as never);
                }
            }

            const finalRecord = await tx.orm.public.service_requests
                .where({ id: recordId as never })
                .include("images")
                .first();

            if (!finalRecord) return null;
            return ServiceRequestMapper.toDomain(finalRecord);
        });
    }

    async findAdminRequests(
        input: GetAdminServiceRequestsInputDto
    ): Promise<{ requests: ServiceRequestDetailsDto[]; total: number; counts: Record<string, number> }> {
        await this.syncExpiredRequests();
        const { page = 1, limit = 10, search, status, sortBy = "NEWEST" } = input;
        const skip = (page - 1) * limit;

        let query = db.orm.public.service_requests;

        if (status && status !== "ALL") {
            query = query.where({ status: status as never });
        }

        if (search && search.trim()) {
            query = query.where((req) => req.title.ilike(`%${search.trim()}%`));
        }

        if (sortBy === "OLDEST") {
            query = query.orderBy((req) => req.updated_at.asc());
        } else {
            query = query.orderBy((req) => req.updated_at.desc());
        }

        const records = await query
            .include("images")
            .include("category")
            .include("subservice")
            .include("address")
            .include("customer", (c) => c.include("customer_profile"))
            .include("providers")
            .offset(skip)
            .limit(limit)
            .all();

        const totalResult = await query.aggregate((agg) => ({ total: agg.count() }));

        const allRecords = await db.orm.public.service_requests.all();

        const counts: Record<string, number> = {
            ALL: allRecords.length,
            DRAFT: 0,
            PENDING: 0,
            ACTIVE: 0,
            ACCEPTED: 0,
            IN_PROGRESS: 0,
            COMPLETED: 0,
            CANCELLED: 0,
            EXPIRED: 0
        };

        allRecords.forEach((r) => {
            if (r.status in counts) {
                counts[r.status] += 1;
            }
        });

        return {
            requests: records.map((record) => ServiceRequestMapper.toDetailsDto(record)),
            total: totalResult.total,
            counts
        };
    }

    async adminCancel(id: string): Promise<ServiceRequest | null> {
        return await db.transaction(async (tx) => {
            const updated = await tx.orm.public.service_requests
                .where({ id: id as never })
                .update({
                    status: "CANCELLED" as never,
                    updated_at: Temporal.Now.instant()
                } as never);

            if (!updated) return null;
            return ServiceRequestMapper.toDomain(updated);
        });
    }

    async reopen(
        id: string,
        customerId: string,
        data: {
            urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
            specificDate: Date | null;
            availableTimeFrom?: string;
            availableTimeTo?: string;
        }
    ): Promise<ServiceRequest | null> {
        return await db.transaction(async (tx) => {
            const existing = await tx.orm.public.service_requests
                .where({ id: id as never, customer_id: customerId as never })
                .first();

            if (!existing) return null;

            if (existing.status !== "EXPIRED") {
                throw new ApplicationError("INVALID_STATE", "Only expired requests can be reopened", "VALIDATION");
            }

            const updatePayload: Record<string, unknown> = {
                status: "PENDING" as never,
                urgency: data.urgency as never,
                specific_date: data.specificDate ? Temporal.Instant.fromEpochMilliseconds(data.specificDate.getTime()) : null,
                updated_at: Temporal.Now.instant()
            };

            if (data.availableTimeFrom) {
                const trimmed = data.availableTimeFrom.trim();
                updatePayload.available_time_from = Temporal.PlainTime.from(trimmed.length === 5 ? `${trimmed}:00` : trimmed);
            }

            if (data.availableTimeTo) {
                const trimmed = data.availableTimeTo.trim();
                updatePayload.available_time_to = Temporal.PlainTime.from(trimmed.length === 5 ? `${trimmed}:00` : trimmed);
            }

            await tx.orm.public.service_requests
                .where({ id: id as never, customer_id: customerId as never })
                .update(updatePayload as never);

            await tx.orm.public.service_request_providers
                .where({ service_request_id: id as never })
                .update({ status: "MATCHED" as never });

            const updated = await tx.orm.public.service_requests
                .where({ id: id as never })
                .include("images")
                .first();

            if (!updated) return null;
            return ServiceRequestMapper.toDomain(updated);
        });
    }

    async updateStatus(id: string, status: string): Promise<ServiceRequest | null> {
        const updated = await db.orm.public.service_requests
            .where({ id: id as never })
            .update({
                status: status as never,
                updated_at: Temporal.Now.instant()
            });

        if (!updated) return null;

        const record = await db.orm.public.service_requests
            .where({ id: id as never })
            .include("images")
            .first();

        if (!record) return null;
        return ServiceRequestMapper.toDomain(record);
    }
}
