import { ProviderService } from "../entities/providerService.entity.js";

export interface IProviderServiceRepository {
    getProviderServices(providerId: string): Promise<ProviderService[]>;
    findByProviderId(providerId: string): Promise<ProviderService[]>;
    addProviderServices(providerId: string, serviceIds: string[]): Promise<ProviderService[]>;
    deleteProviderService(providerId: string, serviceId: string): Promise<ProviderService[]>;
}
