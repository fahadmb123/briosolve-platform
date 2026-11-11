import { Router } from "express";
import { buildCommunicationRoutes } from "../../presentation/routes/communication.routes";
import { createCommunicationController } from "./controller";

export function createCommunicationRoutes(): Router {
    const communicationController = createCommunicationController();
    return buildCommunicationRoutes({
        communication: communicationController
    });
}

export const communicationRoutes = createCommunicationRoutes();

export * from "./useCases";
export * from "./controller";
export * from "./services";
