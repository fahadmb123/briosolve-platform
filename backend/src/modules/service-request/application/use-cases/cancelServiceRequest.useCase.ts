import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { ServiceRequestResponseDto } from "../dtos/response/service-request.dto";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ServiceRequestMapper } from "../../infrastructure/mappers/serviceRequest.mapper";

export interface CancelServiceRequestInputDto {
    customerId: string;
    requestId: string;
}

export class CancelServiceRequestUseCase implements IUseCase<CancelServiceRequestInputDto, ServiceRequestResponseDto> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository
    ) {}

    async execute(input: CancelServiceRequestInputDto): Promise<ServiceRequestResponseDto> {
        if (!input.customerId) {
            throw new ApplicationError("UNAUTHORIZED", "Customer ID is required", "AUTHENTICATION");
        }
        if (!input.requestId) {
            throw new ApplicationError("VALIDATION", "Request ID is required", "VALIDATION");
        }

        const cancelled = await this._serviceRequestRepository.cancel(input.requestId, input.customerId);
        if (!cancelled) {
            throw new ApplicationError("NOT_FOUND", "Service request not found or cannot be cancelled", "NOT_FOUND");
        }

        return ServiceRequestMapper.toDto(cancelled);
    }
}

