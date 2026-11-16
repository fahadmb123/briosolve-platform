import { CommunicationController } from "../../presentation/controller/communication.controller";
import { generateCallTokenUseCase } from "./useCases";

export function createCommunicationController(): CommunicationController {
    return new CommunicationController(generateCallTokenUseCase);
}

export const communicationController = createCommunicationController();
