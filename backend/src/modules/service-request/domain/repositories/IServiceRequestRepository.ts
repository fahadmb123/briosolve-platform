import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { ServiceRequest } from "../entities/serviceRequest.entity";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";
import { UpdateServiceRequestRepoDto } from "../../application/dtos/request/update-service-request.dto";
import {
    ServiceRequestDetailsDto,
    GetCustomerRequestsOutputDto,
    GetProviderRequestsOutputDto
} from "../../application/dtos/response/service-request.dto";
import { GetCustomerServiceRequestsInputDto } from "../../application/use-cases/getCustomerServiceRequests.useCase";
import { GetProviderServiceRequestsInputDto } from "../../application/use-cases/getProviderServiceRequests.useCase";

export interface IServiceRequestRepository extends BaseRepository<ServiceRequest | null> {
    create(data: CreateServiceRequestRepoDto): Promise<ServiceRequest | null>;
    findByCustomerId(input: GetCustomerServiceRequestsInputDto): Promise<{ requests: ServiceRequestDetailsDto[]; total: number; counts: Record<string, number> }>;
    findByProviderId(providerProfileId: string, input?: Omit<GetProviderServiceRequestsInputDto, "userId">): Promise<{ requests: ServiceRequestDetailsDto[]; total: number }>;
    findDetailsById(id: string, customerId: string): Promise<ServiceRequestDetailsDto | null>;
    update(id: string, customerId: string, data: UpdateServiceRequestRepoDto): Promise<ServiceRequest | null>;
    cancel(id: string, customerId: string): Promise<ServiceRequest | null>;
}
