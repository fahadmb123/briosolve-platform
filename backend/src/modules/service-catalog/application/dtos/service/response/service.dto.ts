import { Category } from "../../../../domain/entities/category.entity";

export interface ServiceResponseDto {
    id: string,
    category_id: string,
    name: string,
    description: string | null,
    image: string | null,
    status: "ACTIVE" | "INACTIVE",
    created_at: Date,
    updated_at: Date,
    category?: Category,
}