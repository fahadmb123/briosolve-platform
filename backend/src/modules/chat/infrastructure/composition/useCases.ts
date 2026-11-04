import type { Server } from "socket.io";
import { conversationRepository, conversationParticipantRepository, messageRepository } from "./repositories";
import { StartConversationUseCase } from "../../application/use-cases/startConversation.useCase";
import { GetConversationsUseCase } from "../../application/use-cases/getConversations.useCase";
import { GetMessagesUseCase } from "../../application/use-cases/getMessages.useCase";
import { JoinConversationUseCase } from "../../application/use-cases/joinConversation.useCase";
import { MarkMessagesAsReadUseCase } from "../../application/use-cases/markMessagesAsRead.useCase";
import { SendMessageUseCase } from "../../application/use-cases/sendMessage.useCase";
import { SocketIoMessageDeliveryAdapter } from "../adapters/socket-io-message-delivery.adapter";

export const startConversationUseCase = new StartConversationUseCase(
    conversationRepository,
    conversationParticipantRepository
);

export const getConversationsUseCase = new GetConversationsUseCase(
    conversationRepository
);

export const getMessagesUseCase = new GetMessagesUseCase(
    conversationParticipantRepository,
    messageRepository
);

export const joinConversationUseCase = new JoinConversationUseCase(
    conversationParticipantRepository
);

export const markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(
    conversationParticipantRepository
);

export function createSendMessageUseCase(io: Server): SendMessageUseCase {
    const messageDelivery = new SocketIoMessageDeliveryAdapter(io);
    return new SendMessageUseCase(
        conversationRepository,
        conversationParticipantRepository,
        messageRepository,
        messageDelivery
    );
}

