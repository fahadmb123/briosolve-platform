import type { Prisma } from "@prisma/client";
import { ProviderProfile, KycStatus } from "../../domain/entities/providerProfile.entity";

export type ProviderProfileRecord = Prisma.ProviderProfileGetPayload<{}>;
export type ProviderProfileRaw = ProviderProfileRecord;

export class ProviderProfileMapper {
    static toDomain(record: ProviderProfileRecord): ProviderProfile {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new ProviderProfile(
            record.id,
            record.user_id,
            record.business_name,
            record.experience,
            record.bio,
            record.profile_image ?? null,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw),
            record.service_radius_km !== undefined && record.service_radius_km !== null ? Number(record.service_radius_km) : 20,
            record.accepting_leads !== undefined ? Boolean(record.accepting_leads) : true,
            record.travel_buffer_minutes !== undefined && record.travel_buffer_minutes !== null ? Number(record.travel_buffer_minutes) : 30,
            record.completed_jobs !== undefined && record.completed_jobs !== null ? Number(record.completed_jobs) : 0,
            (record.kyc_status as KycStatus) || "NOT_SUBMITTED",
            record.skills || null
        );
    }
}
