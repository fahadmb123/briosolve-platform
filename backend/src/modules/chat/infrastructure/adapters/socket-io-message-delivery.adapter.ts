import type { Server } from "socket.io";
import type { IMessageDelivery } from "../../application/interfaces/IMessageDelivery";
import type { Message } from "../../domain/entities/message.entity";

export class SocketIoMessageDeliveryAdapter implements IMessageDelivery {
    constructor(
        private readonly _io: Server
    ) {}

    async sendToConversation(conversationId: string, message: Message, participantUserIds?: string[]): Promise<void> {
        const rooms = [`conversation:${conversationId}`];
        if (participantUserIds && participantUserIds.length > 0) {
            for (const uid of participantUserIds) {
                rooms.push(`user:${uid}`);
            }
        }

        this._io
            .to(rooms)
            .emit("message:new", message);
    }

    async emitReadReceipt(conversationId: string, readByUserId: string, participantUserIds?: string[]): Promise<void> {
        const rooms = [`conversation:${conversationId}`];
        if (participantUserIds && participantUserIds.length > 0) {
            for (const uid of participantUserIds) {
                rooms.push(`user:${uid}`);
            }
        }

        this._io
            .to(rooms)
            .emit("conversation:read", {
                conversation_id: conversationId,
                read_by: readByUserId,
                read_at: new Date().toISOString()
            });
    }
}

