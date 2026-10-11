import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { IProviderAvailabilityRepository, AvailabilitySlotInput } from "../../domain/repositories/IProviderAvailabilityRepository.js";
import { ProviderAvailability } from "../../domain/entities/providerAvailability.entity.js";
import { ProviderAvailabilityMapper, ProviderAvailabilityRaw } from "../mappers/providerAvailability.mapper.js";

export class ProviderAvailabilityRepository implements IProviderAvailabilityRepository {
    async findByProviderId(providerId: string): Promise<ProviderAvailability[]> {
        const rows = await db.orm.public.provider_availability
            .where({ provider_id: providerId as never })
            .all();

        return rows.map((r) => ProviderAvailabilityMapper.toDomain(r as ProviderAvailabilityRaw));
    }

    async setAvailability(providerId: string, slots: AvailabilitySlotInput[]): Promise<ProviderAvailability[]> {
        const existing = await db.orm.public.provider_availability
            .where({ provider_id: providerId as never })
            .all();

        await Promise.all(
            existing.map((item) =>
                db.orm.public.provider_availability
                    .where({ id: item.id })
                    .delete()
            )
        );

        const created: ProviderAvailability[] = [];
        for (const slot of slots) {
            const raw = await db.orm.public.provider_availability.create({
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
    }
}
