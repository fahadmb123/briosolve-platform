import type { Prisma } from "@prisma/client";
import { Service } from "../../domain/entities/service.entity";
import { CategoryMapper, CategoryRecord } from "./category.mapper.";
import { AddServiceUseCaseInputDto } from "../../application/dtos/service/request/add-service.dto";
import { StorageUtil } from "../../../../shared/utils/storage.util";

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
            StorageUtil.getPublicUrl(record.image),
            record.status,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw),
            record.category ? CategoryMapper.toDomain(record.category as CategoryRecord) : undefined,
            record.questions ? (record.questions as any) : null
        );
    }

    static toPersistence(input: AddServiceUseCaseInputDto) {
        return {
            name: input.name.toLowerCase(),
            category_id: input.category_id,
            description: input.description,
            status: input.status,
            image: input.image,
            questions: input.questions ? (input.questions as any) : null
        };
    }
}
