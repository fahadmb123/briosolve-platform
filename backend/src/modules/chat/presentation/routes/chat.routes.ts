import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import validate from "../../../../shared/middlewares/validate-request";
import { startConversationSchema, sendMessageSchema } from "../validators/chat.validator";

export function createChatRouter(chatController: ChatController): Router {
    const router = Router();

    router.use(authMiddleware);

    router.post("/conversations", validate(startConversationSchema), chatController.startConversation);
    router.get("/conversations", chatController.getConversations);
    router.get("/conversations/:conversationId/messages", chatController.getMessages);
    router.post("/conversations/:conversationId/messages", validate(sendMessageSchema), chatController.sendMessage);
    router.patch("/conversations/:conversationId/read", chatController.markAsRead);

    return router;
}

