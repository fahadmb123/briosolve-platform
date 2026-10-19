import type { Prisma } from "@prisma/client";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { ServiceMapper, ServiceRecord } from "./service.mapper";

export type ProviderServiceRecord = Prisma.ProviderServiceGetPayload<{}>;
export type ProviderServiceRaw = ProviderServiceRecord;

export class ProviderServiceMapper {
    static toDomain(record: ProviderServiceRecord): ProviderService {
        const createdAtRaw: any = record.created_at;

        return new ProviderService(
            record.id,
            record.provider_id,
            record.service_id,
            createdAtRaw instanceof Date
                ? createdAtRaw
                : typeof createdAtRaw === "object" && createdAtRaw && "epochMilliseconds" in createdAtRaw
                ? new Date(Number(createdAtRaw.epochMilliseconds))
                : new Date(createdAtRaw),
            record.service ? ServiceMapper.toDomain(record.service as ServiceRecord) : undefined
        );
    }
}
