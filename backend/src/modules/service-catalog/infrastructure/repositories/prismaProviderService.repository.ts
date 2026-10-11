import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { ProviderService } from "../../domain/entities/providerService.entity.js";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository.js";
import { ProviderServiceMapper, ProviderServiceRaw } from "../mappers/providerService.mapper.js";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository.js";

export class ProviderServiceRepository implements IProviderServiceRepository {
    constructor(private readonly providerRepository: IProviderRepository) {}

    async getProviderServices(userId: string): Promise<ProviderService[]> {
        const profile = await this.providerRepository.findById(userId);
        const providerId = profile ? profile.id : userId;
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
}
