import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { GetProviderRequestsOutputDto } from "../dtos/response/service-request.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export interface GetProviderServiceRequestsInputDto {
    userId: string;
    page?: number;
    limit?: number;
    search?: string;
    urgency?: string;
    budgetType?: string;
    sortBy?: "NEWEST" | "URGENT" | "BUDGET_HIGH";
}

export class GetProviderServiceRequestsUseCase implements IUseCase<GetProviderServiceRequestsInputDto, GetProviderRequestsOutputDto> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _providerRepository: IProviderRepository
    ) {}

    async execute(input: GetProviderServiceRequestsInputDto): Promise<GetProviderRequestsOutputDto> {
        if (!input.userId) {
            throw new ApplicationError("UNAUTHORIZED", "Provider user ID is required", "AUTHENTICATION");
        }

        const profile = await this._providerRepository.findProfileByUserId(input.userId);
        if (!profile) {
            return {
                requests: [],
                total: 0,
                totalPages: 0,
                page: input.page || 1,
                limit: input.limit || 10
            };
        }

        const page = input.page || 1;
        const limit = input.limit || 10;
        const response = await this._serviceRequestRepository.findByProviderId(profile.id, {
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
            limit
        };
    }
}
