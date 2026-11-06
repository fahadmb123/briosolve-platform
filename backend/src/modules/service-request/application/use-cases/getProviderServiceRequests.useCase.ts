import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IServiceRequestRepository } from "../../domain/repositories/IServiceRequestRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { ServiceRequestDetailsDto } from "../dtos/response/service-request.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export interface GetProviderServiceRequestsInputDto {
    userId: string;
}

export class GetProviderServiceRequestsUseCase implements IUseCase<GetProviderServiceRequestsInputDto, ServiceRequestDetailsDto[]> {
    constructor(
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _providerRepository: IProviderRepository
    ) {}

    async execute(input: GetProviderServiceRequestsInputDto): Promise<ServiceRequestDetailsDto[]> {
        if (!input.userId) {
            throw new ApplicationError("UNAUTHORIZED", "Provider user ID is required", "AUTHENTICATION");
        }

        const profile = await this._providerRepository.findProfileByUserId(input.userId);
        if (!profile) {
            return [];
        }

        return await this._serviceRequestRepository.findByProviderId(profile.id);
    }
}

