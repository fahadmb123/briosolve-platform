import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { ServiceRequest } from "../entities/serviceRequest.entity";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";
import { ServiceRequestDetailsDto } from "../../application/dtos/response/service-request.dto";

export interface IServiceRequestRepository extends BaseRepository<ServiceRequest | null> {
    create(data: CreateServiceRequestRepoDto): Promise<ServiceRequest | null>;
    findByCustomerId(customerId: string): Promise<ServiceRequestDetailsDto[]>;
    cancel(id: string, customerId: string): Promise<ServiceRequest | null>;
}

