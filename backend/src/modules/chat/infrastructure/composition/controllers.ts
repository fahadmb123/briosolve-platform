import type { Server } from "socket.io";
import { ChatController } from "../../presentation/controllers/chat.controller";
import { S3Service } from "../../../../shared/services/s3.service";
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
    const imageUploadService = new S3Service();
    return new ChatController(
        startConversationUseCase,
        getConversationsUseCase,
        getMessagesUseCase,
        sendMessageUseCase,
        markMessagesAsReadUseCase,
        imageUploadService
    );
}
