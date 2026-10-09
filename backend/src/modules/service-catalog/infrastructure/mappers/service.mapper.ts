import { Service } from "../../domain/entities/service.entity.js";

export class ServiceMapper {
    static toDomain(raw: any): Service {
        return new Service(
            raw.id,
            raw.category_id,
            raw.name,
            raw.description,
            raw.image,
            raw.status,
            raw.created_at,
            raw.updated_at
        )
    }
}
