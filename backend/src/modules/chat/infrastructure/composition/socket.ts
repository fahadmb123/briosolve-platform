import { ChatSocketHandler } from "../../presentation/socket/chat.socket-handler";
import { joinConversationUseCase } from "./useCases";

export const chatSocketHandler = new ChatSocketHandler(joinConversationUseCase);

export function createChatSocketHandler(): ChatSocketHandler {
    return chatSocketHandler;
}
