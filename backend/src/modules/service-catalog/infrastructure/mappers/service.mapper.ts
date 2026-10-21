import type { Prisma } from "@prisma/client";
import { Service } from "../../domain/entities/service.entity";
import { CategoryMapper, CategoryRecord } from "./category.mapper.";
import { AddServiceUseCaseInputDto } from "../../application/dtos/service/request/add-service.dto";

export type ServiceRecord = Prisma.ServiceGetPayload<{}>;

export class ServiceMapper {
    static toDomain(record: ServiceRecord): Service {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new Service(
            record.id,
            record.category_id,
            record.name,
            record.description ?? null,
            record.image ?? null,
            record.status,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw),
            record.category ? CategoryMapper.toDomain(record.category as CategoryRecord) : undefined
        );
    }

    static toPersistence(input: AddServiceUseCaseInputDto) {
        return {
            name: input.name.toLowerCase(),
            category_id: input.category_id,
            description: input.description,
            status: input.status,
            image: input.image
        };
    }
}
