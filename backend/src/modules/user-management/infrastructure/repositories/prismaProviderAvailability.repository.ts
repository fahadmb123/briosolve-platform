import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { IProviderAvailabilityRepository, AvailabilitySlotInput, CreateAvailabilityOverrideInput } from "../../domain/repositories/IProviderAvailabilityRepository";
import { ProviderAvailability } from "../../domain/entities/providerAvailability.entity";
import { ProviderAvailabilityOverride } from "../../domain/entities/providerAvailabilityOverride.entity";
import { ProviderAvailabilityMapper, ProviderAvailabilityRaw } from "../mappers/providerAvailability.mapper";
import { ProviderAvailabilityOverrideMapper, ProviderAvailabilityOverrideRaw } from "../mappers/providerAvailabilityOverride.mapper";

export class ProviderAvailabilityRepository implements IProviderAvailabilityRepository {
    async findByProviderId(providerId: string): Promise<ProviderAvailability[]> {
        const rows = await db.orm.public.provider_availability
            .where({ provider_id: providerId as never })
            .all();

        return rows.map((r) => ProviderAvailabilityMapper.toDomain(r as ProviderAvailabilityRaw));
    }

    async setAvailability(providerId: string, slots: AvailabilitySlotInput[]): Promise<ProviderAvailability[]> {
        return await db.transaction(async (tx) => {
            const existing = await tx.orm.public.provider_availability
                .where({ provider_id: providerId as never })
                .all();

            for (const item of existing) {
                await tx.orm.public.provider_availability
                    .where({ id: item.id })
                    .delete();
            }

            const created: ProviderAvailability[] = [];
            for (const slot of slots) {
                const raw = await tx.orm.public.provider_availability.create({
                    provider_id: providerId as never,
                    day_of_week: slot.day_of_week as never,
                    start_time: slot.start_time as never,
                    end_time: slot.end_time as never,
                    created_at: Temporal.Now.instant(),
                    updated_at: Temporal.Now.instant()
                } as never);
                created.push(ProviderAvailabilityMapper.toDomain(raw as ProviderAvailabilityRaw));
            }

            return created;
        });
    }

    async findOverridesByProviderId(providerId: string): Promise<ProviderAvailabilityOverride[]> {
        const rows = await db.orm.public.provider_availability_overrides
            .where({ provider_id: providerId as never })
            .all();

        return rows
            .map((r) => ProviderAvailabilityOverrideMapper.toDomain(r as ProviderAvailabilityOverrideRaw))
            .sort((a, b) => a.override_date.getTime() - b.override_date.getTime());
    }

    async createOverride(providerId: string, data: CreateAvailabilityOverrideInput): Promise<ProviderAvailabilityOverride> {
        const raw = await db.orm.public.provider_availability_overrides.create({
            provider_id: providerId as never,
            override_date: Temporal.Instant.from(data.override_date.toISOString()),
            type: data.type as never,
            start_time: (data.start_time || null) as never,
            end_time: (data.end_time || null) as never,
            reason: (data.reason || null) as never,
            created_at: Temporal.Now.instant(),
            updated_at: Temporal.Now.instant()
        } as never);

        return ProviderAvailabilityOverrideMapper.toDomain(raw as ProviderAvailabilityOverrideRaw);
    }

    async deleteOverride(providerId: string, overrideId: string): Promise<void> {
        const existing = await db.orm.public.provider_availability_overrides
            .where({ id: overrideId as never, provider_id: providerId as never })
            .first();

        if (existing) {
            await db.orm.public.provider_availability_overrides
                .where({ id: existing.id })
                .delete();
        }
    }
}
