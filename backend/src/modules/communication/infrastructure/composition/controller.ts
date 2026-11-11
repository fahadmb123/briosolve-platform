import { CommunicationController } from "../../presentation/controller/communication.controller";
import { sendCommunicationUseCase, getCommunicationsUseCase, generateCallTokenUseCase } from "./useCases";

export function createCommunicationController(): CommunicationController {
    return new CommunicationController(
        sendCommunicationUseCase,
        getCommunicationsUseCase,
        generateCallTokenUseCase
    );
}

export const communicationController = createCommunicationController();

