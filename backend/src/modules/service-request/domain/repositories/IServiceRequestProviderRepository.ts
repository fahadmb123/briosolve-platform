import { ServiceRequestProvider, ServiceRequestProviderStatus } from "../entities/serviceRequestProvider.entity";
import { ServiceRequestDetailsDto } from "../../application/dtos/response/service-request.dto";
import { GetProviderServiceRequestsInputDto } from "../../application/use-cases/getProviderServiceRequests.useCase";

export interface IServiceRequestProviderRepository {
    create(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider>;
    createMany(serviceRequestId: string, providerIds: string[]): Promise<ServiceRequestProvider[]>;
    findByServiceRequestId(serviceRequestId: string): Promise<ServiceRequestProvider[]>;
    findByProviderId(
        providerProfileId: string,
        input?: Omit<GetProviderServiceRequestsInputDto, "userId">
    ): Promise<{ requests: ServiceRequestDetailsDto[]; total: number; counts?: Record<string, number> }>;
    findMatchesByProviderId(providerId: string): Promise<ServiceRequestProvider[]>;
    findByRequestAndProviderId(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider | null>;
    updateStatus(serviceRequestId: string, providerId: string, status: ServiceRequestProviderStatus): Promise<ServiceRequestProvider | null>;
    markAsViewed(serviceRequestId: string, providerId: string): Promise<ServiceRequestProvider | null>;
}
