import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { ServiceRequest } from "../../domain/entities/serviceRequest.entity";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";
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
