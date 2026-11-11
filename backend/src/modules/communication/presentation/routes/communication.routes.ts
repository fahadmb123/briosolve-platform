import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import validate from "../../../../shared/middlewares/validate-request";
import { sendCommunicationSchema, generateCallTokenSchema } from "../schemas/communication.schema";
import { CommunicationRouteDependencies } from "../types/communication.route.dependencies";

export function buildCommunicationRoutes(controller: CommunicationRouteDependencies): Router {
    const router = Router();

    router.use(authMiddleware);
    router.post("/", validate(sendCommunicationSchema), controller.communication.sendCommunication);
    router.get("/", controller.communication.getCommunications);
    router.post("/call/token", validate(generateCallTokenSchema), controller.communication.generateCallToken);

    return router;
}

