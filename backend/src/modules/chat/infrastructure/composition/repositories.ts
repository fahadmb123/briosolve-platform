import { ConversationRepository } from "../repositories/conversation.repository";
import { ConversationParticipantRepository } from "../repositories/conversationParticipant.repository";
import { MessageRepository } from "../repositories/message.repository";

export const conversationRepository = new ConversationRepository();
export const conversationParticipantRepository = new ConversationParticipantRepository();
export const messageRepository = new MessageRepository();

