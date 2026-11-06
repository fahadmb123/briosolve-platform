import type { Server } from "socket.io";
import type { Router } from "express";
import { createChatController } from "./controllers";
import { createChatRouter } from "../../presentation/routes/chat.routes";
import { createChatSocketHandler } from "./socket";

export function createChatRoutes(io: Server): Router {
    const chatController = createChatController(io);
    return createChatRouter(chatController);
}

export { createChatSocketHandler };
export * from "./repositories";
export * from "./useCases";
export * from "./controllers";

