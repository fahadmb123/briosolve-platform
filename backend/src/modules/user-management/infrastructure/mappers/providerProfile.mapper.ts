import type { Prisma } from "@prisma/client";
import { Temporal } from "@js-temporal/polyfill";
import { ProviderProfile, KycStatus } from "../../domain/entities/providerProfile.entity";
import { CreateProviderInput, CreateProviderProfileInput } from "../../domain/repositories/IProviderRepository";
import { UpdateProviderProfileInputDataDto } from "../../application/dtos/request/provider/update-provider-profile.dto";

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
            record.skills || null,
            (record as any).services ?? []
        );
    }

    static toPersistence(userId: string, data: CreateProviderInput | CreateProviderProfileInput | UpdateProviderProfileInputDataDto) {
        const d = data as UpdateProviderProfileInputDataDto & Partial<CreateProviderInput>;
        const businessName = d.business_name ?? d.businessName ?? "";
        const experience = d.experience ?? "";
        const bio = d.bio ?? "";
        const profileImage = d.profile_image ?? null;
        const serviceRadiusKm = d.service_radius_km !== undefined && d.service_radius_km !== null ? d.service_radius_km : 20;
        const acceptingLeads = d.accepting_leads !== undefined && d.accepting_leads !== null ? d.accepting_leads : true;
        const travelBufferMinutes = d.travel_buffer_minutes !== undefined && d.travel_buffer_minutes !== null ? d.travel_buffer_minutes : 30;

        return {
            user_id: userId as never,
            business_name: businessName as never,
            experience: experience as never,
            bio: bio as never,
            profile_image: profileImage as never,
            service_radius_km: serviceRadiusKm as never,
            accepting_leads: acceptingLeads as never,
            travel_buffer_minutes: travelBufferMinutes as never,
            created_at: Temporal.Now.instant(),
            updated_at: Temporal.Now.instant()
        };
    }

    static toPersistenceService(providerId: string, serviceId: string) {
        return {
            provider_id: providerId as never,
            service_id: serviceId as never
        };
    }
}
