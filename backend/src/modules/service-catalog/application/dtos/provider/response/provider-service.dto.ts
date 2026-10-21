import { Service } from "../../../../domain/entities/service.entity";

export interface ProviderServiceResponseDto {
    id: string,
    provider_id: string,
    service_id: string,
    created_at: Date,
    service?: Service
}