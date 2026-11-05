import type { Server } from "socket.io";
import type { IMessageDelivery } from "../../application/interfaces/IMessageDelivery";
import type { Message } from "../../domain/entities/message.entity";
import type { INotificationDelivery } from "../../../notification/application/interfaces/INotificationDelivery";

export class SocketIoMessageDeliveryAdapter implements IMessageDelivery {
    constructor(
        private readonly _io: Server,
        private readonly _pushDelivery?: INotificationDelivery
    ) {}

    async sendToConversation(conversationId: string, message: Message, recipientUserIds?: string[]): Promise<void> {
        const rooms = [`conversation:${conversationId}`];
        if (recipientUserIds && recipientUserIds.length > 0) {
            for (const uid of recipientUserIds) {
                rooms.push(`user:${uid}`);
            }
        }

        this._io
            .to(rooms)
            .emit("message:new", message);

        if (this._pushDelivery && recipientUserIds && recipientUserIds.length > 0) {
            const activeSockets = await this._io.in(`conversation:${conversationId}`).fetchSockets();
            const activeUserIds = new Set(
                activeSockets.map((s) => String(s.data.user?.userId ?? (s.data as any)?.userId).trim())
            );

            const senderIdStr = String(message.sender_id).trim();

            const targetPushRecipientIds = recipientUserIds.filter((id) => {
                const idStr = String(id).trim();
                return idStr !== senderIdStr && !activeUserIds.has(idStr);
            });

            for (const recipientId of targetPushRecipientIds) {
                this._pushDelivery.deliver({
                    id: message.id,
                    recipient_id: recipientId,
                    type: "INFO",
                    title: "New Message",
                    message: message.content,
                    is_read: false,
                    read_at: null,
                    created_at: message.created_at
                }).catch(() => {});
            }
        }
    }

    async emitReadReceipt(conversationId: string, readByUserId: string, recipientUserIds?: string[]): Promise<void> {
        const rooms = [`conversation:${conversationId}`];
        if (recipientUserIds && recipientUserIds.length > 0) {
            for (const uid of recipientUserIds) {
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

