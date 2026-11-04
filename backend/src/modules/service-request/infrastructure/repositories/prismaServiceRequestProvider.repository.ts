import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { ServiceRequestProvider, ServiceRequestProviderStatus } from "../../domain/entities/serviceRequestProvider.entity";
import { IServiceRequestProviderRepository } from "../../domain/repositories/IServiceRequestProviderRepository";
import { ServiceRequestProviderMapper } from "../mappers/serviceRequestProvider.mapper";

export class ServiceRequestProviderRepository implements IServiceRequestProviderRepository {
    async create(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider> {
        const record = await db.orm.public.service_request_providers.create(
            ServiceRequestProviderMapper.toPersistence(serviceRequestId, providerId) as never
        );

        return ServiceRequestProviderMapper.toDomain(record);
    }

    async createMany(serviceRequestId: string, providerIds: string[]): Promise<ServiceRequestProvider[]> {
        return await db.transaction(async (tx) => {
            const results: ServiceRequestProvider[] = [];
            for (const providerId of providerIds) {
                const existing = await tx.orm.public.service_request_providers
                    .where({
                        service_request_id: serviceRequestId as never,
                        provider_id: providerId as never
                    })
                    .first();

                if (!existing) {
                    const record = await tx.orm.public.service_request_providers.create(
                        ServiceRequestProviderMapper.toPersistence(serviceRequestId, providerId) as never
                    );
                    results.push(ServiceRequestProviderMapper.toDomain(record));
                } else {
                    results.push(ServiceRequestProviderMapper.toDomain(existing));
                }
            }
            return results;
        });
    }

    async findByServiceRequestId(serviceRequestId: string): Promise<ServiceRequestProvider[]> {
        const records = await db.orm.public.service_request_providers
            .where({ service_request_id: serviceRequestId as never })
            .include("provider")
            .all();

        return records.map((record) => ServiceRequestProviderMapper.toDomain(record));
    }

    async findByProviderId(providerId: string): Promise<ServiceRequestProvider[]> {
        const records = await db.orm.public.service_request_providers
            .where({ provider_id: providerId as never })
            .all();

        return records.map((record) => ServiceRequestProviderMapper.toDomain(record));
    }

    async findByRequestAndProviderId(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider | null> {
        const record = await db.orm.public.service_request_providers
            .where({
                service_request_id: serviceRequestId as never,
                provider_id: providerId as never
            })
            .first();

        if (!record) return null;
        return ServiceRequestProviderMapper.toDomain(record);
    }

    async updateStatus(
        serviceRequestId: string,
        providerId: string,
        status: ServiceRequestProviderStatus
    ): Promise<ServiceRequestProvider | null> {
        const existing = await db.orm.public.service_request_providers
            .where({
                service_request_id: serviceRequestId as never,
                provider_id: providerId as never
            })
            .first();

        if (!existing) return null;

        await db.orm.public.service_request_providers
            .where({ id: existing.id })
            .update({
                status: status as never,
                ...(status === "VIEWED" && !existing.viewed_at
                    ? { viewed_at: Temporal.Now.instant() as never }
                    : {})
            });

        const updated = await db.orm.public.service_request_providers
            .where({ id: existing.id })
            .first();

        if (!updated) return null;
        return ServiceRequestProviderMapper.toDomain(updated);
    }

    async markAsViewed(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider | null> {
        return this.updateStatus(serviceRequestId, providerId, "VIEWED");
    }
}

