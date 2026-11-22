import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IQuotationRepository } from "../../domain/repositories/IQuotationRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IServiceRequestProviderRepository } from "../../../service-request/domain/repositories/IServiceRequestProviderRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { SubmitQuotationInputDto } from "../dtos/request/submit-quotation.dto";
import { QuotationResponseDto } from "../dtos/response/quotation-response.dto";
import { QuotationMapper } from "../../infrastructure/mappers/quotation.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class SubmitQuotationUseCase implements IUseCase<SubmitQuotationInputDto, QuotationResponseDto> {
    constructor(
        private readonly _quotationRepository: IQuotationRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _serviceRequestProviderRepository: IServiceRequestProviderRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: SubmitQuotationInputDto): Promise<QuotationResponseDto> {
        const providerProfile = await this._providerRepository.findProfileByUserId(input.providerUserId);
        if (!providerProfile) {
            throw new ApplicationError("PROVIDER_NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        const serviceRequest = await this._serviceRequestRepository.findById(input.serviceRequestId);
        if (!serviceRequest) {
            throw new ApplicationError("REQUEST_NOT_FOUND", "Service request not found", "NOT_FOUND");
        }

        if (serviceRequest.status === "ACCEPTED" || serviceRequest.status === "IN_PROGRESS") {
            throw new ApplicationError("REQUEST_ACCEPTED", "This service request has already been accepted by another provider and is no longer accepting quotations", "CONFLICT");
        }

        if (serviceRequest.status === "COMPLETED") {
            throw new ApplicationError("REQUEST_COMPLETED", "This service request has already been completed and is no longer accepting quotations", "CONFLICT");
        }

        if (serviceRequest.status === "EXPIRED") {
            throw new ApplicationError("REQUEST_EXPIRED", "This service request has expired and is no longer accepting quotations", "CONFLICT");
        }

        if (serviceRequest.status === "CANCELLED") {
            throw new ApplicationError("REQUEST_CANCELLED", "This service request has been cancelled and is no longer accepting quotations", "CONFLICT");
        }

        if (serviceRequest.status === "CLOSED") {
            throw new ApplicationError("REQUEST_CLOSED", "This service request has been closed via diagnosis settlement and is no longer accepting quotations", "CONFLICT");
        }

        if (serviceRequest.status !== "PENDING" && serviceRequest.status !== "ACTIVE") {
            throw new ApplicationError("INVALID_STATE", "Cannot quote on a non-active service request", "VALIDATION");
        }

        const allExistingQuotes = await this._quotationRepository.findByServiceRequestId(input.serviceRequestId);
        const acceptedQuote = allExistingQuotes.find((q) => q.status === "ACCEPTED");
        if (acceptedQuote) {
            throw new ApplicationError("REQUEST_ACCEPTED", "This service request has already been accepted by another provider and is no longer accepting quotations", "CONFLICT");
        }

        const existingQuote = await this._quotationRepository.findByRequestIdAndProviderId(
            input.serviceRequestId,
            providerProfile.id
        );
        if (existingQuote) {
            throw new ApplicationError("ALREADY_QUOTED", "You have already submitted a quotation for this request", "CONFLICT");
        }

        const created = await this._quotationRepository.create({
            ...input,
            providerId: providerProfile.id
        });

        if (!created) {
            throw new ApplicationError("CREATION_FAILED", "Failed to create quotation record", "INTERNAL");
        }

        await this._serviceRequestProviderRepository.updateStatus(
            input.serviceRequestId,
            providerProfile.id,
            "QUOTED"
        );

        if (this._createNotificationUseCase) {
            try {
                
                await this._createNotificationUseCase.execute({
                    recipientId: serviceRequest.customer_id,
                    type: "INFO",
                    title_code: "NEW_QUOTATION",
                    title: "New Quotation Received",
                    message: `A provider submitted a quotation of ₹${input.amount} for "${serviceRequest.title}".`
                });
            } catch {
                return QuotationMapper.toResponseDto(created);
            }
        }

        return QuotationMapper.toResponseDto(created);
    }
}
