import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository";
import { ProviderServiceMapper } from "../mappers/providerService.mapper";


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
            ProviderServiceMapper.toDomain(record)
        );
    }

    async addProviderServices(providerId: string, serviceIds: string[]): Promise<ProviderService[]> {
        return await db.transaction(async (tx) => {
            for (const serviceId of serviceIds) {
                const existing = await tx.orm.public.provider_services
                    .where({ provider_id: providerId, service_id: serviceId as never })
                    .first();

                if (!existing) {
                    await tx.orm.public.provider_services.create({
                        provider_id: providerId,
                        service_id: serviceId as never
                    } as never);
                }
            }

            const records = await tx.orm.public.provider_services
                .where({ provider_id: providerId })
                .include("service", (q) => q.include("category"))
                .all();

            return records.map((record) =>
                ProviderServiceMapper.toDomain(record)
            );
        });
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

    async deleteProviderCategory(providerId: string, categoryId: string): Promise<ProviderService[]> {
        return await db.transaction(async (tx) => {
            const records = await tx.orm.public.provider_services
                .where({ provider_id: providerId })
                .include("service")
                .all();

            for (const record of records) {
                const service = record.service as { category_id?: string } | null;
                if (service && service.category_id === categoryId) {
                    await tx.orm.public.provider_services
                        .where({ id: record.id })
                        .delete();
                }
            }

            const remaining = await tx.orm.public.provider_services
                .where({ provider_id: providerId })
                .include("service", (q) => q.include("category"))
                .all();

            return remaining.map((record) =>
                ProviderServiceMapper.toDomain(record)
            );
        });
    }
}

