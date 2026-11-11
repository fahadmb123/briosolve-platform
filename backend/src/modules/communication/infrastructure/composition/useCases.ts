import { SendCommunicationUseCase } from "../../application/use-cases/sendCommunication.useCase";
import { GetCommunicationsUseCase } from "../../application/use-cases/getCommunications.useCase";
import { GenerateCallTokenUseCase } from "../../application/use-cases/generateCallToken.useCase";
import { communicationRepository } from "./repositories";
import { liveKitService } from "./services";

export const sendCommunicationUseCase = new SendCommunicationUseCase(communicationRepository);
export const getCommunicationsUseCase = new GetCommunicationsUseCase(communicationRepository);
export const generateCallTokenUseCase = new GenerateCallTokenUseCase(liveKitService);

