import { CommunicationController } from "../../presentation/controller/communication.controller";
import { sendCommunicationUseCase, getCommunicationsUseCase } from "./useCases";

export function createCommunicationController(): CommunicationController {
    return new CommunicationController(
        sendCommunicationUseCase,
        getCommunicationsUseCase
    );
}

export const communicationController = createCommunicationController();

