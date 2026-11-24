import type { Prisma } from "@prisma/client";
import { Category } from "../../domain/entities/category.entity";
import { ServiceMapper } from "./service.mapper";
import { AddCategoryUseCaseInputDto } from "../dtos/category/request/add-category.dto";
import { StorageUtil } from "../../../../shared/utils/storage.util";

export type CategoryRecord = Prisma.CategoryGetPayload<{}>;

export class CategoryMapper {
    static toDomain(record: CategoryRecord): Category {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new Category(
            record.id,
            record.name,
            record.description ?? null,
            record.status,
            StorageUtil.getPublicUrl(record.image),
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw),
            record.services ? record.services.map((s: any) => ServiceMapper.toDomain(s)) : undefined
        );
    }

    static toPersistence(input: AddCategoryUseCaseInputDto) {
        return {
            name: input.name.toLowerCase(),
            description: input.description,
            status: input.status,
            image: input.image
        };
    }
}
