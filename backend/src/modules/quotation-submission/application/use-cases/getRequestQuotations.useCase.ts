import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IQuotationRepository } from "../../domain/repositories/IQuotationRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { IUserRepository } from "../../../user-management/domain/repositories/IUserRepository";
import { GetRequestQuotationsInputDto } from "../dtos/request/get-request-quotations.dto";
import { RequestQuotationsResponseDto, RequestQuotationItemDto } from "../dtos/response/request-quotations-response.dto";
import { QuotationMapper } from "../mappers/quotation.mapper";

export class GetRequestQuotationsUseCase implements IUseCase<GetRequestQuotationsInputDto, RequestQuotationsResponseDto> {
    constructor(
        private readonly _quotationRepository: IQuotationRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(input: GetRequestQuotationsInputDto): Promise<RequestQuotationsResponseDto> {
        const serviceRequest = await this._serviceRequestRepository.findById(input.serviceRequestId);
        if (!serviceRequest) {
            throw new ApplicationError("REQUEST_NOT_FOUND", "Service request not found", "NOT_FOUND");
        }

        if (input.userRole === "CUSTOMER" && serviceRequest.customer_id !== input.userId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to view quotations for this request", "AUTHENTICATION");
        }

        const quotations = await this._quotationRepository.findByServiceRequestId(input.serviceRequestId);

        let acceptedQuotationId: string | null = null;
        const quotationDtos: RequestQuotationItemDto[] = await Promise.all(
            quotations.map(async (q) => {
                if (q.status === "ACCEPTED") {
                    acceptedQuotationId = q.id;
                }

                let providerProfile = await this._providerRepository.findById(q.provider_id);
                if (!providerProfile) {
                    providerProfile = await this._providerRepository.findProfileByUserId(q.provider_id);
                }

                let providerUser: any = null;
                if (providerProfile?.user_id) {
                    providerUser = await this._userRepository.findById(providerProfile.user_id);
                }
                if (!providerUser) {
                    providerUser = await this._userRepository.findById(q.provider_id);
                }

                return QuotationMapper.toRequestQuotationItemDto(q, providerProfile, providerUser);
            })
        );

        quotationDtos.sort((a, b) => {
            if (a.status === "ACCEPTED") return -1;
            if (b.status === "ACCEPTED") return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return QuotationMapper.toRequestQuotationsResponseDto(quotationDtos, acceptedQuotationId);
    }
}
