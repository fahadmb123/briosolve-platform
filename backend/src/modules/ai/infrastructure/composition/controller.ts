import { AiController } from "../../presentation/controllers/ai.controller";
import { CompareQuotationsUseCase } from "../../application/use-cases/compareQuotations.useCase";

export function createAiController(compareQuotationsUC: CompareQuotationsUseCase): AiController {
    return new AiController(compareQuotationsUC);
}
