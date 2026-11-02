import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { ServiceRequest } from "../../domain/entities/serviceRequest.entity";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";
import { ServiceRequestMapper } from "../mappers/serviceRequest.mapper";

export class ServiceRequestRepository implements IServiceRequestRepository {
    async findById(id: string): Promise<ServiceRequest | null> {
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
