import { ProviderServiceRaw } from "../../application/Dto/providerService";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { ServiceMapper } from "./service.mapper";

export class ProviderServiceMapper {
    static toDomain(raw: ProviderServiceRaw): ProviderService {
        return new ProviderService(
            raw.id,
            raw.provider_id,
            raw.service_id,
            raw.created_at instanceof Date
                ? raw.created_at
                : typeof raw.created_at === "object" && raw.created_at && "epochMilliseconds" in raw.created_at
                ? new Date(raw.created_at.epochMilliseconds)
                : new Date(raw.created_at),
            raw.service ? ServiceMapper.toDomain(raw.service) : undefined
        );
    }
}
