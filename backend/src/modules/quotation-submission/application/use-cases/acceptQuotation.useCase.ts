import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IQuotationRepository } from "../../domain/repositories/IQuotationRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { AcceptQuotationInputDto } from "../dtos/request/accept-quotation.dto";
import { AcceptQuotationResponseDto } from "../dtos/response/accept-quotation-response.dto";
import { QuotationMapper } from "../../infrastructure/mappers/quotation.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class AcceptQuotationUseCase implements IUseCase<AcceptQuotationInputDto, AcceptQuotationResponseDto> {
    constructor(
        private readonly _quotationRepository: IQuotationRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: AcceptQuotationInputDto): Promise<AcceptQuotationResponseDto> {
        const quotation = await this._quotationRepository.findById(input.quotationId);
        if (!quotation) {
            throw new ApplicationError("QUOTATION_NOT_FOUND", "Quotation not found", "NOT_FOUND");
        }

        if (quotation.status !== "PENDING") {
            throw new ApplicationError("INVALID_STATE", `Cannot accept a quotation that is ${quotation.status}`, "VALIDATION");
        }

        if (quotation.valid_until_date && new Date().getTime() > new Date(quotation.valid_until_date).getTime()) {
            await this._quotationRepository.update(quotation.id, {
                status: "EXPIRED",
                rejectionReason: "Quotation validity expired"
            });
            throw new ApplicationError("QUOTATION_EXPIRED", "This quotation has expired and can no longer be accepted", "VALIDATION");
        }

        const serviceRequest = await this._serviceRequestRepository.findById(quotation.service_request_id);
        if (!serviceRequest) {
            throw new ApplicationError("REQUEST_NOT_FOUND", "Service request not found", "NOT_FOUND");
        }

        if (serviceRequest.customer_id !== input.customerUserId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to accept quotations for this request", "AUTHENTICATION");
        }

        if (serviceRequest.status === "CANCELLED" || serviceRequest.status === "EXPIRED" || serviceRequest.status === "COMPLETED") {
            throw new ApplicationError("INVALID_STATE", `Cannot accept quotation for a ${serviceRequest.status.toLowerCase()} request`, "VALIDATION");
        }

        await this._quotationRepository.update(quotation.id, {
            status: "ACCEPTED"
        });

        const allQuotes = await this._quotationRepository.findByServiceRequestId(quotation.service_request_id);
        const otherQuotes = allQuotes.filter((q) => q.id !== quotation.id && q.status === "PENDING");

        for (const other of otherQuotes) {
            await this._quotationRepository.update(other.id, {
                status: "REJECTED",
                rejectionReason: "Another quotation was accepted by the customer"
            });
        }

        await this._serviceRequestRepository.updateStatus(serviceRequest.id, "ACCEPTED");

        if (this._createNotificationUseCase) {
            const acceptedProfile = await this._providerRepository.findById(quotation.provider_id);

            if (acceptedProfile) {
                await this._createNotificationUseCase.execute({
                    recipientId: acceptedProfile.user_id,
                    type: "QUOTATION_ACCEPTED",
                    title: "Quotation Accepted!",
                    title_code: "QUOTATION_ACCEPTED",
                    message: `Great news! Your quotation of ₹${quotation.amount} for "${serviceRequest.title}" was accepted.`
                }).catch(() => null);
            }

            for (const other of otherQuotes) {
                const otherProfile = await this._providerRepository.findById(other.provider_id);

                if (otherProfile) {
                    await this._createNotificationUseCase.execute({
                        recipientId: otherProfile.user_id,
                        type: "QUOTATION_REJECTED",
                        title: "Quotation Update",
                        title_code: "QUOTATION_REJECTED",
                        message: `Another quotation was accepted for "${serviceRequest.title}". Thank you for your submission.`
                    }).catch(() => null);
                }
            }
        }

        return QuotationMapper.toAcceptQuotationResponseDto(
            quotation.id,
            "ACCEPTED",
            serviceRequest.id
        );
    }
}
