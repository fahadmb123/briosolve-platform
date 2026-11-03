import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestDetailsDto } from "../dtos/response/service-request.dto";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";

export interface GetCustomerServiceRequestsInputDto {
    customerId: string;
}

export class GetCustomerServiceRequestsUseCase implements IUseCase<GetCustomerServiceRequestsInputDto, ServiceRequestDetailsDto[]> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository
    ) {}

    async execute(input: GetCustomerServiceRequestsInputDto): Promise<ServiceRequestDetailsDto[]> {
        if (!input.customerId) {
            throw new ApplicationError("UNAUTHORIZED", "Customer ID is required", "AUTHENTICATION");
        }
        return await this._serviceRequestRepository.findByCustomerId(input.customerId);
    }
}

