import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IQuotationRepository } from "../../domain/repositories/IQuotationRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { UpdateQuotationInputDto } from "../dtos/request/update-quotation.dto";
import { QuotationResponseDto } from "../dtos/response/quotation-response.dto";
import { QuotationMapper } from "../../infrastructure/mappers/quotation.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class UpdateQuotationUseCase implements IUseCase<UpdateQuotationInputDto, QuotationResponseDto> {
    constructor(
        private readonly _quotationRepository: IQuotationRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: UpdateQuotationInputDto): Promise<QuotationResponseDto> {
        if (!input.providerUserId) {
            throw new ApplicationError("UNAUTHORIZED", "Provider user ID is required", "AUTHENTICATION");
        }

        const providerProfile = await this._providerRepository.findProfileByUserId(input.providerUserId);
        if (!providerProfile) {
            throw new ApplicationError("PROVIDER_NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        const existingQuote = await this._quotationRepository.findById(input.quotationId);
        if (!existingQuote) {
            throw new ApplicationError("QUOTATION_NOT_FOUND", "Quotation not found", "NOT_FOUND");
        }

        if (existingQuote.provider_id !== providerProfile.id) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to edit this quotation", "AUTHORIZATION");
        }

        if (existingQuote.status !== "PENDING") {
            throw new ApplicationError(
                "CANNOT_EDIT",
                `Only PENDING quotations can be modified. Current status is ${existingQuote.status}.`,
                "VALIDATION"
            );
        }

        const serviceRequest = await this._serviceRequestRepository.findById(existingQuote.service_request_id);
        if (!serviceRequest) {
            throw new ApplicationError("REQUEST_NOT_FOUND", "Service request not found", "NOT_FOUND");
        }

        if (serviceRequest.status === "ACCEPTED" || serviceRequest.status === "IN_PROGRESS") {
            throw new ApplicationError("REQUEST_ACCEPTED", "This service request has already been accepted and quotations cannot be modified", "CONFLICT");
        }

        if (serviceRequest.status === "COMPLETED") {
            throw new ApplicationError("REQUEST_COMPLETED", "This service request has already been completed and quotations cannot be modified", "CONFLICT");
        }

        if (serviceRequest.status === "EXPIRED") {
            throw new ApplicationError("REQUEST_EXPIRED", "This service request has expired and quotations cannot be modified", "CONFLICT");
        }

        if (serviceRequest.status === "CANCELLED") {
            throw new ApplicationError("REQUEST_CANCELLED", "This service request has been cancelled and quotations cannot be modified", "CONFLICT");
        }

        if (serviceRequest.status !== "PENDING" && serviceRequest.status !== "ACTIVE") {
            throw new ApplicationError("INVALID_STATE", "Cannot update quotation on a service request that is no longer active", "VALIDATION");
        }

        const { providerUserId, quotationId, ...updateData } = input;
        const updated = await this._quotationRepository.update(quotationId, updateData);

        if (!updated) {
            throw new ApplicationError("UPDATE_FAILED", "Failed to update quotation", "INTERNAL");
        }

        if (this._createNotificationUseCase) {
            try {
                const serviceRequest = await this._serviceRequestRepository.findById(existingQuote.service_request_id);
                if (serviceRequest?.customer_id) {
                    await this._createNotificationUseCase.execute({
                        recipientId: serviceRequest.customer_id,
                        type: "INFO",
                        title_code: "QUOTATION_UPDATED",
                        title: "Quotation Updated",
                        message: `A provider updated their quotation to ₹${updated.amount} for "${serviceRequest.title}".`
                    });
                }
            } catch {
                return QuotationMapper.toResponseDto(updated);
            }
        }

        return QuotationMapper.toResponseDto(updated);
    }
}
