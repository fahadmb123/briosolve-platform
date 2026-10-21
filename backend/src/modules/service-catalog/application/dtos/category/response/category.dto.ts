import { Service } from "../../../../domain/entities/service.entity";

export interface CategoryResponseDto {
    id: string,
    name: string,
    description: string | null,
    status: "ACTIVE" | "INACTIVE",
    image: string,
    created_at: Date,
    updated_at: Date,
    services?: Service[]
}