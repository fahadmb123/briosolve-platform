import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IQuotationRepository } from "../../domain/repositories/IQuotationRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { RejectQuotationInputDto } from "../dtos/request/reject-quotation.dto";
import { RejectQuotationResponseDto } from "../dtos/response/reject-quotation-response.dto";
import { QuotationMapper } from "../../infrastructure/mappers/quotation.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class RejectQuotationUseCase implements IUseCase<RejectQuotationInputDto, RejectQuotationResponseDto> {
    constructor(
        private readonly _quotationRepository: IQuotationRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: RejectQuotationInputDto): Promise<RejectQuotationResponseDto> {
        const quotation = await this._quotationRepository.findById(input.quotationId);
        if (!quotation) {
            throw new ApplicationError("QUOTATION_NOT_FOUND", "Quotation not found", "NOT_FOUND");
        }

        if (quotation.status !== "PENDING") {
            throw new ApplicationError("INVALID_STATE", `Cannot decline a quotation that is ${quotation.status}`, "VALIDATION");
        }

        const serviceRequest = await this._serviceRequestRepository.findById(quotation.service_request_id);
        if (!serviceRequest) {
            throw new ApplicationError("REQUEST_NOT_FOUND", "Service request not found", "NOT_FOUND");
        }

        if (serviceRequest.customer_id !== input.customerUserId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to decline quotations for this request", "AUTHENTICATION");
        }

        const resolvedReason = input.reason && input.reason.trim() ? input.reason.trim() : "Declined by customer";

        await this._quotationRepository.update(quotation.id, {
            status: "REJECTED",
            rejectionReason: resolvedReason
        });

        if (this._createNotificationUseCase) {
            const providerProfile = await this._providerRepository.findById(quotation.provider_id);

            if (providerProfile) {
                await this._createNotificationUseCase.execute({
                    recipientId: providerProfile.user_id,
                    type: "QUOTATION_REJECTED",
                    title: "Quotation Declined",
                    title_code: "QUOTATION_REJECTED",
                    message: `The customer declined your quotation for "${serviceRequest.title}". Reason: ${resolvedReason}`
                }).catch(() => null);
            }
        }

        return QuotationMapper.toRejectQuotationResponseDto(
            quotation.id,
            "REJECTED"
        );
    }
}
