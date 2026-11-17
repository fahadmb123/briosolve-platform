import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IQuotationRepository } from "../../domain/repositories/IQuotationRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { GetRequestQuotationsInputDto } from "../dtos/request/get-request-quotations.dto";
import { RequestQuotationsResponseDto, RequestQuotationItemDto } from "../dtos/response/request-quotations-response.dto";
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

                return {
                    id: q.id,
                    serviceRequestId: q.service_request_id,
                    providerId: q.provider_id,
                    provider: {
                        id: providerProfile?.id ?? q.provider_id,
                        userId: providerProfile?.user_id ?? "",
                        name: providerUser?.name ?? "Service Provider",
                        businessName: providerProfile?.business_name ?? providerUser?.name ?? "Provider",
                        profileImage: providerProfile?.profile_image ?? null,
                        experience: providerProfile?.experience ?? "",
                        completedJobs: providerProfile?.completed_jobs ?? 0,
                        phone: providerUser?.phone ?? null,
                        email: providerUser?.email ?? null
                    },
                    amount: q.amount,
                    quotationType: q.quotation_type,
                    workDescription: q.work_description,
                    includedItems: q.included_items,
                    excludedItems: q.excluded_items,
                    estimatedDuration: q.estimated_duration,
                    availableDateTime: q.available_date_time,
                    validUntil: q.valid_until,
                    validUntilDate: q.valid_until_date instanceof Date ? q.valid_until_date.toISOString() : String(q.valid_until_date),
                    extraChargePolicy: q.extra_charge_policy,
                    status: q.status,
                    createdAt: q.created_at instanceof Date ? q.created_at.toISOString() : String(q.created_at),
                    updatedAt: q.updated_at instanceof Date ? q.updated_at.toISOString() : String(q.updated_at)
                };
            })
        );

        quotationDtos.sort((a, b) => {
            if (a.status === "ACCEPTED") return -1;
            if (b.status === "ACCEPTED") return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        return {
            quotations: quotationDtos,
            total: quotationDtos.length,
            acceptedQuotationId
        };
    }
}
