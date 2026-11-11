import { GenerateCallTokenUseCase } from "../../application/use-cases/generateCallToken.useCase";
import { liveKitService } from "./services";

export const generateCallTokenUseCase = new GenerateCallTokenUseCase(liveKitService);
