import { SendCommunicationUseCase } from "../../application/use-cases/sendCommunication.useCase";
import { GetCommunicationsUseCase } from "../../application/use-cases/getCommunications.useCase";
import { communicationRepository } from "./repositories";

export const sendCommunicationUseCase = new SendCommunicationUseCase(communicationRepository);
export const getCommunicationsUseCase = new GetCommunicationsUseCase(communicationRepository);

