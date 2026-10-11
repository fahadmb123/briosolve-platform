import { ProviderService } from "../entities/providerService.entity.js";

export interface IProviderServiceRepository {
    getProviderServices(userId: string): Promise<ProviderService[]>;
    findByProviderId(providerId: string): Promise<ProviderService[]>;
}
