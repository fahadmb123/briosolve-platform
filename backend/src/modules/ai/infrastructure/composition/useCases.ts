import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { GetRequestQuotationsInputDto } from "../../../quotation-submission/application/dtos/request/get-request-quotations.dto";
import { RequestQuotationsResponseDto } from "../../../quotation-submission/application/dtos/response/request-quotations-response.dto";
import { CompareQuotationsUseCase } from "../../application/use-cases/compareQuotations.useCase";
import { ILlmAdapter } from "../../domain/adapters/ILlmAdapter";
import { createLlmAdapter } from "./adapters";

export function createCompareQuotationsUseCase(
    getRequestQuotationsUseCase: IUseCase<GetRequestQuotationsInputDto, RequestQuotationsResponseDto>,
    llmAdapter?: ILlmAdapter
): CompareQuotationsUseCase {
    const adapter = llmAdapter || createLlmAdapter();
    return new CompareQuotationsUseCase(getRequestQuotationsUseCase, adapter);
}
