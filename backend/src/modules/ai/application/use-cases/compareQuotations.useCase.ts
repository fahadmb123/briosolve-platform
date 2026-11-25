import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { ILlmAdapter } from "../../domain/adapters/ILlmAdapter";
import { CompareQuotationsRequestDto } from "../dtos/request/compare-quotations.request.dto";
import { CompareQuotationsResponseDto } from "../dtos/response/compare-quotations.response.dto";
import { GetRequestQuotationsInputDto } from "../../../quotation-submission/application/dtos/request/get-request-quotations.dto";
import { RequestQuotationsResponseDto } from "../../../quotation-submission/application/dtos/response/request-quotations-response.dto";
import {
    buildQuotationComparisonSystemPrompt,
    buildQuotationComparisonUserPrompt,
    QuotationComparisonBidPayload
} from "../prompts";

export class CompareQuotationsUseCase implements IUseCase<CompareQuotationsRequestDto, CompareQuotationsResponseDto> {
    constructor(
        private readonly _getRequestQuotationsUseCase: IUseCase<GetRequestQuotationsInputDto, RequestQuotationsResponseDto>,
        private readonly _llmAdapter: ILlmAdapter
    ) {}

    async execute(input: CompareQuotationsRequestDto): Promise<CompareQuotationsResponseDto> {
        if (!input.serviceRequestId) {
            throw new ApplicationError("MISSING_SERVICE_REQUEST_ID", "Service request ID is required", "VALIDATION");
        }

        const quotationResult = await this._getRequestQuotationsUseCase.execute({
            serviceRequestId: input.serviceRequestId,
            userId: input.userId,
            userRole: "CUSTOMER"
        });

        const quotations = quotationResult.quotations || [];
        if (quotations.length === 0) {
            throw new ApplicationError("NO_QUOTATIONS_AVAILABLE", "No quotations have been submitted for this request yet", "NOT_FOUND");
        }

        const topN = Math.max(1, Math.min(input.topN || 3, quotations.length));

        const sanitizedBids: QuotationComparisonBidPayload[] = quotations.map((q) => ({
            quotationId: q.id,
            amount: q.amount,
            quotationType: q.quotationType,
            workDescription: q.workDescription,
            includedItems: q.includedItems,
            excludedItems: q.excludedItems,
            estimatedDuration: q.estimatedDuration,
            availableDateTime: q.availableDateTime,
            extraChargePolicy: q.extraChargePolicy,
            status: q.status,
            provider: {
                id: q.provider.id,
                businessName: q.provider.businessName,
                name: q.provider.name,
                experience: q.provider.experience,
                completedJobs: q.provider.completedJobs
            }
        }));

        const systemPrompt = buildQuotationComparisonSystemPrompt(topN);
        const userPrompt = buildQuotationComparisonUserPrompt(sanitizedBids, topN);

        const result = await this._llmAdapter.generateJsonResponse<CompareQuotationsResponseDto>(
            systemPrompt,
            userPrompt
        );

        if (!result || !result.recommendedWinnerId || !Array.isArray(result.rankings)) {
            throw new ApplicationError("AI_MALFORMED_OUTPUT", "AI model failed to format comparison properly", "INTERNAL");
        }

        const boundedRankings = result.rankings.slice(0, topN).map((item, idx) => ({
            quotationId: item.quotationId,
            providerName: item.providerName || "Provider",
            rank: idx + 1,
            score: typeof item.score === "number" ? item.score : 80,
            pros: Array.isArray(item.pros) ? item.pros : [],
            cons: Array.isArray(item.cons) ? item.cons : [],
            verdict: item.verdict || ""
        }));

        const winnerExists = boundedRankings.some((r) => r.quotationId === result.recommendedWinnerId);
        const resolvedWinnerId = winnerExists ? result.recommendedWinnerId : (boundedRankings[0]?.quotationId || quotations[0].id);

        return {
            recommendedWinnerId: resolvedWinnerId,
            rankings: boundedRankings,
            aiSummary: result.aiSummary || "Comparison completed based on price, provider experience, and scope of work."
        };
    }
}
