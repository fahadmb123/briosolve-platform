import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { ServiceRequest } from "../entities/serviceRequest.entity";
import { CreateServiceRequestRepoDto } from "../../application/dtos/request/create-service-request.dto";
import { UpdateServiceRequestRepoDto } from "../../application/dtos/request/update-service-request.dto";
import {
    ServiceRequestDetailsDto,
    GetCustomerRequestsOutputDto,
    GetAdminServiceRequestsInputDto
} from "../../application/dtos/response/service-request.dto";
import { GetCustomerServiceRequestsInputDto } from "../../application/use-cases/getCustomerServiceRequests.useCase";

export interface IServiceRequestRepository extends BaseRepository<ServiceRequest | null> {
    create(data: CreateServiceRequestRepoDto): Promise<ServiceRequest | null>;
    findByCustomerId(input: GetCustomerServiceRequestsInputDto): Promise<{ requests: ServiceRequestDetailsDto[]; total: number; counts: Record<string, number> }>;
    findAdminRequests(input: GetAdminServiceRequestsInputDto): Promise<{ requests: ServiceRequestDetailsDto[]; total: number; counts: Record<string, number> }>;
    findDetailsById(id: string, customerId: string): Promise<ServiceRequestDetailsDto | null>;
    update(id: string, customerId: string, data: UpdateServiceRequestRepoDto): Promise<ServiceRequest | null>;
    cancel(id: string, customerId: string): Promise<ServiceRequest | null>;
    adminCancel(id: string): Promise<ServiceRequest | null>;
    reopen(
        id: string,
        customerId: string,
        data: {
            urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
            specificDate: Date | null;
            availableTimeFrom?: string;
            availableTimeTo?: string;
        }
    ): Promise<ServiceRequest | null>;
}
