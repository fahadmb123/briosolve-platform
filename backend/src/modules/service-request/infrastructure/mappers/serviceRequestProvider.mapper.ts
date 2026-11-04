import { Temporal } from "@js-temporal/polyfill";
import type { Prisma } from "@prisma/client";
import { ServiceRequestProvider, ServiceRequestProviderStatus } from "../../domain/entities/serviceRequestProvider.entity";
import { ServiceRequestMapper } from "./serviceRequest.mapper";
import { ProviderProfileMapper } from "../../../user-management/infrastructure/mappers/providerProfile.mapper";

export type ServiceRequestProviderRecord = Prisma.ServiceRequestProviderGetPayload<{}>;
export type ServiceRequestProviderRaw = ServiceRequestProviderRecord;

export class ServiceRequestProviderMapper {
    static toDomain(record: ServiceRequestProviderRecord): ServiceRequestProvider {
        const matchedAtRaw = record.matched_at;
        const viewedAtRaw = record.viewed_at;

        const parseDate = (val: typeof matchedAtRaw | typeof viewedAtRaw): Date | null => {
            if (!val) return null;
            if (val instanceof Date) return val;
            if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
                const epoch = (val as { epochMilliseconds: bigint | number }).epochMilliseconds;
                return new Date(Number(epoch));
            }
            return new Date(val as unknown as string | Date);
        };

        const matchedAt = parseDate(matchedAtRaw) ?? new Date();
        const viewedAt = parseDate(viewedAtRaw);

        return new ServiceRequestProvider(
            record.id,
            record.service_request_id,
            record.provider_id,
            record.status as ServiceRequestProviderStatus,
            matchedAt,
            viewedAt,
            record.service_request ? ServiceRequestMapper.toDomain(record.service_request) : undefined,
            (record as any).provider ? ProviderProfileMapper.toDomain((record as any).provider) : undefined
        );
    }

    static toPersistence(serviceRequestId: string, providerId: string, status: ServiceRequestProviderStatus = "MATCHED") {
        return {
            service_request_id: serviceRequestId as never,
            provider_id: providerId as never,
            status: status as never,
            matched_at: Temporal.Now.instant(),
            viewed_at: null
        };
    }
}

