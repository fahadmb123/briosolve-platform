import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IQuotationRepository } from "../../domain/repositories/IQuotationRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { GetProviderQuotationsInputDto } from "../dtos/request/get-provider-quotations.dto";
import { ProviderQuotationsResponseDto } from "../dtos/response/provider-quotations-response.dto";
import { QuotationMapper } from "../mappers/quotation.mapper";

export class GetProviderQuotationsUseCase implements IUseCase<GetProviderQuotationsInputDto, ProviderQuotationsResponseDto> {
    constructor(
        private readonly _quotationRepository: IQuotationRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository
    ) {}

    async execute(input: GetProviderQuotationsInputDto): Promise<ProviderQuotationsResponseDto> {
        if (!input.providerUserId) {
            throw new ApplicationError("UNAUTHORIZED", "Provider user ID is required", "AUTHENTICATION");
        }

        const providerProfile = await this._providerRepository.findProfileByUserId(input.providerUserId);
        if (!providerProfile) {
            throw new ApplicationError("PROVIDER_NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        const result = await this._quotationRepository.findByProviderId(providerProfile.id, {
            page: input.page,
            limit: input.limit,
            status: input.status,
            sortBy: input.sortBy
        });

        const quotationDtos = await Promise.all(
            result.quotations.map(async (q) => {
                const serviceRequest = await this._serviceRequestRepository.findById(q.service_request_id);
                return QuotationMapper.toProviderItemDto(q, serviceRequest?.title ?? null);
            })
        );

        return QuotationMapper.toProviderQuotationsResponseDto(
            quotationDtos,
            result.total,
            result.totalPages,
            result.page,
            result.limit,
            result.counts
        );
    }
}
