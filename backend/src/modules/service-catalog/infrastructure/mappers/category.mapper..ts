import { Category } from "../../domain/entities/category.entity.js";

export class CategoryMapper {
    static toDomain(raw:Category):Category{
        return new Category(
            raw.id,
            raw.name,
            raw.description,
            raw.status,
            raw.image,
            raw.created_at,
            raw.updated_at
        )
    }
}