import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { ServiceRequest } from "../../domain/entities/serviceRequest.entity";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";
import { UpdateServiceRequestRepoDto } from "../../application/dtos/request/update-service-request.dto";
import { ServiceRequestDetailsDto } from "../../application/dtos/response/service-request.dto";
import { ServiceRequestMapper } from "../mappers/serviceRequest.mapper";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";

export class ServiceRequestRepository implements IServiceRequestRepository {
    async findById(id: string): Promise<ServiceRequest | null> {
        const record = await db.orm.public.service_requests
            .where({ id: id as never })
            .include("images")
            .first();

        if (!record) return null;
        return ServiceRequestMapper.toDomain(record);
    }

    async findDetailsById(id: string, customerId: string): Promise<ServiceRequestDetailsDto | null> {
        const record = await db.orm.public.service_requests
            .where({ id: id as never, customer_id: customerId as never })
            .include("images")
            .include("category")
            .include("subservice")
            .include("address")
            .include("providers")
            .first();

        if (!record) return null;
        return ServiceRequestMapper.toDetailsDto(record);
    }

    async findByCustomerId(customerId: string): Promise<ServiceRequestDetailsDto[]> {
        const records = await db.orm.public.service_requests
            .where({ customer_id: customerId as never })
            .include("images")
            .include("category")
            .include("subservice")
            .include("address")
            .include("providers")
            .orderBy((req) => req.created_at.desc())
            .all();

        return records.map((record) => ServiceRequestMapper.toDetailsDto(record));
    }

    async update(id: string, customerId: string, data: UpdateServiceRequestRepoDto): Promise<ServiceRequest | null> {
        return await db.transaction(async (tx) => {
            const updatePayload: Record<string, unknown> = {
                updated_at: Temporal.Now.instant()
            };

            if (data.title !== undefined) updatePayload.title = data.title;
            if (data.description !== undefined) updatePayload.description = data.description;
            if (data.categoryId !== undefined) updatePayload.category_id = data.categoryId;
            if (data.subserviceId !== undefined) updatePayload.subservice_id = data.subserviceId;
            if (data.urgency !== undefined) updatePayload.urgency = data.urgency;
            if (data.selectedAddressId !== undefined) updatePayload.address_id = data.selectedAddressId;

            if (data.specificDate !== undefined) {
                if (data.specificDate) {
                    const dateObj = new Date(data.specificDate);
                    updatePayload.specific_date = Temporal.Instant.fromEpochMilliseconds(dateObj.getTime());
                } else {
                    updatePayload.specific_date = null;
                }
            }

            if (data.availableTimeFrom !== undefined) {
                const trimmed = data.availableTimeFrom.trim();
                const normalized = trimmed.length === 5 ? `${trimmed}:00` : trimmed;
                updatePayload.available_time_from = Temporal.PlainTime.from(normalized);
            }

            if (data.availableTimeTo !== undefined) {
                const trimmed = data.availableTimeTo.trim();
                const normalized = trimmed.length === 5 ? `${trimmed}:00` : trimmed;
                updatePayload.available_time_to = Temporal.PlainTime.from(normalized);
            }

            if (data.budgetType !== undefined) updatePayload.budget_type = data.budgetType;
            if (data.budgetAmount !== undefined) {
                updatePayload.budget_amount = data.budgetAmount !== null ? Number(data.budgetAmount) : null;
            }

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
            throw new ApplicationError("INVALID_STATE", "Only pending or active requests can be cancelled", "VALIDATION");
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
}
