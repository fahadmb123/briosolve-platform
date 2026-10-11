import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { ProviderService } from "../../domain/entities/providerService.entity.js";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository.js";
import { ProviderServiceMapper } from "../mappers/providerService.mapper.js";
import { ProviderServiceRaw } from "../../application/Dto/providerService.js";

export class ProviderServiceRepository implements IProviderServiceRepository {
    async getProviderServices(providerId: string): Promise<ProviderService[]> {
        return this.findByProviderId(providerId);
    }

    async findByProviderId(providerId: string): Promise<ProviderService[]> {
        const records = await db.orm.public.provider_services
            .where({ provider_id: providerId })
            .include("service", (q) => q.include("category"))
            .all();

        return records.map((record) =>
            ProviderServiceMapper.toDomain(record as unknown as ProviderServiceRaw)
        );
    }

    async addProviderServices(providerId: string, serviceIds: string[]): Promise<ProviderService[]> {
        for (const serviceId of serviceIds) {
            const existing = await db.orm.public.provider_services
                .where({ provider_id: providerId, service_id: serviceId as never })
                .first();

            if (!existing) {
                await db.orm.public.provider_services.create({
                    provider_id: providerId,
                    service_id: serviceId as never
                } as never);
            }
        }

        return this.findByProviderId(providerId);
    }

    async deleteProviderService(providerId: string, serviceId: string): Promise<ProviderService[]> {
        const byId = await db.orm.public.provider_services
            .where({ provider_id: providerId, id: serviceId as never })
            .first();

        if (byId) {
            await db.orm.public.provider_services
                .where({ id: byId.id })
                .delete();
        } else {
            const byServiceId = await db.orm.public.provider_services
                .where({ provider_id: providerId, service_id: serviceId as never })
                .first();

            if (byServiceId) {
                await db.orm.public.provider_services
                    .where({ id: byServiceId.id })
                    .delete();
            }
        }

        return this.findByProviderId(providerId);
    }
}
