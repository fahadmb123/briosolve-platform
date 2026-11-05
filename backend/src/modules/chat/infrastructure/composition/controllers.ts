import type { Server } from "socket.io";
import { ChatController } from "../../presentation/controllers/chat.controller";
import {
    startConversationUseCase,
    getConversationsUseCase,
    getMessagesUseCase,
    createMarkMessagesAsReadUseCase,
    createSendMessageUseCase
} from "./useCases";

export function createChatController(io: Server): ChatController {
    const sendMessageUseCase = createSendMessageUseCase(io);
    const markMessagesAsReadUseCase = createMarkMessagesAsReadUseCase(io);
    return new ChatController(
        startConversationUseCase,
        getConversationsUseCase,
        getMessagesUseCase,
        sendMessageUseCase,
        markMessagesAsReadUseCase
    );
}

