import type { Server } from "socket.io";
import type { IMessageDelivery } from "../../application/interfaces/IMessageDelivery";
import type { Message } from "../../domain/entities/message.entity";

export class SocketIoMessageDeliveryAdapter implements IMessageDelivery {
    constructor(
        private readonly _io: Server
    ) {}

    async sendToConversation(conversationId: string, message: Message): Promise<void> {
        this._io
            .to(`conversation:${conversationId}`)
            .emit("message:new", message);
    }

    async emitReadReceipt(conversationId: string, readByUserId: string): Promise<void> {
        this._io
            .to(`conversation:${conversationId}`)
            .emit("conversation:read", {
                conversation_id: conversationId,
                read_by: readByUserId,
                read_at: new Date().toISOString()
            });
    }
}

