import { Category } from "../../domain/entities/category.entity";
import { ServiceMapper } from "./service.mapper";

export class CategoryMapper {
    static toDomain(raw: any): Category {
        return new Category(
            raw.id,
            raw.name,
            raw.description,
            raw.status,
            raw.image,
            raw.created_at,
            raw.updated_at,
            raw.services ? raw.services.map((s: any) => ServiceMapper.toDomain(s)) : undefined
        )
    }
}