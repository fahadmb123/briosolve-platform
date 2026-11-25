import { Router } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { GetRequestQuotationsInputDto } from "../../../quotation-submission/application/dtos/request/get-request-quotations.dto";
import { RequestQuotationsResponseDto } from "../../../quotation-submission/application/dtos/response/request-quotations-response.dto";
import { createCompareQuotationsUseCase } from "./useCases";
import { createAiController } from "./controller";
import { buildAiRoute } from "../../presentation/routes/ai.routes";

export function createAiRoutes(
    getRequestQuotationsUseCase: IUseCase<GetRequestQuotationsInputDto, RequestQuotationsResponseDto>
): Router {
    const compareQuotationsUC = createCompareQuotationsUseCase(getRequestQuotationsUseCase);
    const aiController = createAiController(compareQuotationsUC);
    return buildAiRoute({ ai: aiController });
}

export * from "./adapters";
export * from "./useCases";
export * from "./controller";
