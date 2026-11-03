import { ServiceRequestProvider, ServiceRequestProviderStatus } from "../entities/serviceRequestProvider.entity";

export interface IServiceRequestProviderRepository {
    create(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider>;
    createMany(serviceRequestId: string, providerIds: string[]): Promise<ServiceRequestProvider[]>;
    findByServiceRequestId(serviceRequestId: string): Promise<ServiceRequestProvider[]>;
    findByProviderId(providerId: string): Promise<ServiceRequestProvider[]>;
    findByRequestAndProviderId(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider | null>;
    updateStatus(serviceRequestId: string, providerId: string, status: ServiceRequestProviderStatus): Promise<ServiceRequestProvider | null>;
    markAsViewed(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider | null>;
}

