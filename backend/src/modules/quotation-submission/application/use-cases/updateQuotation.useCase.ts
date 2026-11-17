import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IQuotationRepository } from "../../domain/repositories/IQuotationRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { UpdateQuotationInputDto } from "../dtos/request/update-quotation.dto";
import { QuotationResponseDto } from "../dtos/response/quotation-response.dto";
import { QuotationMapper } from "../../infrastructure/mappers/quotation.mapper";

export class UpdateQuotationUseCase implements IUseCase<UpdateQuotationInputDto, QuotationResponseDto> {
    constructor(
        private readonly _quotationRepository: IQuotationRepository,
        private readonly _providerRepository: IProviderRepository
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

        const { providerUserId, quotationId, ...updateData } = input;
        const updated = await this._quotationRepository.update(quotationId, updateData);

        if (!updated) {
            throw new ApplicationError("UPDATE_FAILED", "Failed to update quotation", "INTERNAL");
        }

        return QuotationMapper.toResponseDto(updated);
    }
}
