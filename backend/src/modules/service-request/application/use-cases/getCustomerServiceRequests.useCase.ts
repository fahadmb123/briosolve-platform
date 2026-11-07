import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { GetCustomerRequestsOutputDto } from "../dtos/response/service-request.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export interface GetCustomerServiceRequestsInputDto {
    customerId: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: "NEWEST" | "OLDEST";
}

export class GetCustomerServiceRequestsUseCase implements IUseCase<GetCustomerServiceRequestsInputDto, GetCustomerRequestsOutputDto> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository
    ) {}

    async execute(input: GetCustomerServiceRequestsInputDto): Promise<GetCustomerRequestsOutputDto> {
        if (!input.customerId) {
            throw new ApplicationError("UNAUTHORIZED", "Customer ID is required", "AUTHENTICATION");
        }

        const page = input.page || 1;
        const limit = input.limit || 10;
        const response = await this._serviceRequestRepository.findByCustomerId({
            ...input,
            page,
            limit
        });

        const totalPages = Math.ceil(response.total / limit);
        return {
            requests: response.requests,
            total: response.total,
            totalPages,
            page,
            limit,
            counts: response.counts
        };
    }
}
