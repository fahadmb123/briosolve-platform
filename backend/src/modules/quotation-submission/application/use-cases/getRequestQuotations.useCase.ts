import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IQuotationRepository } from "../../domain/repositories/IQuotationRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { GetRequestQuotationsInputDto } from "../dtos/request/get-request-quotations.dto";
import { RequestQuotationsResponseDto, RequestQuotationItemDto } from "../dtos/response/request-quotations-response.dto";
import { QuotationMapper } from "../../infrastructure/mappers/quotation.mapper";
import { db } from "../../../../shared/database/client";

export class GetRequestQuotationsUseCase implements IUseCase<GetRequestQuotationsInputDto, RequestQuotationsResponseDto> {
    constructor(
        private readonly _quotationRepository: IQuotationRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository
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

                const providerProfile = await db.orm.public.provider_profiles
                    .where({ id: q.provider_id as never })
                    .first();

                let providerUser: any = null;
                if (providerProfile) {
                    providerUser = await db.orm.public.users
                        .where({ id: providerProfile.user_id as never })
                        .first();
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
