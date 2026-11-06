import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { ServiceRequest } from "../entities/serviceRequest.entity";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";
import { UpdateServiceRequestRepoDto } from "../../application/dtos/request/update-service-request.dto";
import { ServiceRequestDetailsDto } from "../../application/dtos/response/service-request.dto";

export interface IServiceRequestRepository extends BaseRepository<ServiceRequest | null> {
    create(data: CreateServiceRequestRepoDto): Promise<ServiceRequest | null>;
    findByCustomerId(customerId: string): Promise<ServiceRequestDetailsDto[]>;
    findByProviderId(providerProfileId: string): Promise<ServiceRequestDetailsDto[]>;
    findDetailsById(id: string, customerId: string): Promise<ServiceRequestDetailsDto | null>;
    update(id: string, customerId: string, data: UpdateServiceRequestRepoDto): Promise<ServiceRequest | null>;
    cancel(id: string, customerId: string): Promise<ServiceRequest | null>;
}
