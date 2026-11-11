import { randomUUID } from "node:crypto";
import type { Server, Socket } from "socket.io";
import type { SocketData } from "../../../../shared/realtime/types/socket-data.types";
import type { INotificationDelivery } from "../../../notification/application/interfaces/INotificationDelivery";

export interface InitiateCallPayload {
    recipientId: string;
    roomName: string;
    callType: "audio" | "video";
    callerName: string;
    callerAvatar?: string;
}

export interface AcceptCallPayload {
    callerId: string;
    roomName: string;
}

export interface RejectCallPayload {
    callerId: string;
    roomName: string;
    reason?: string;
}

export interface EndCallPayload {
    targetUserId: string;
    roomName: string;
}

export class CallSocketHandler {
    constructor(
        private readonly _io: Server,
        private readonly _pushDelivery?: INotificationDelivery
    ) {}

    register(socket: Socket<any, any, any, SocketData>): void {
        const userId = socket.data.user?.userId;
        const normalizedUserId = String(userId).trim();

        socket.on("call:initiate", (payload: InitiateCallPayload) => {
            if (!payload || !payload.recipientId) return;
            const recipientId = String(payload.recipientId).trim();

            this._io.to(`user:${recipientId}`).emit("call:incoming", {
                callerId: normalizedUserId,
                callerName: payload.callerName,
                callerAvatar: payload.callerAvatar,
                roomName: payload.roomName,
                callType: payload.callType || "audio"
            });

            if (this._pushDelivery) {
                const callTypeLabel = payload.callType === "video" ? "Video" : "Audio";
                this._pushDelivery.deliver({
                    id: randomUUID(),
                    recipient_id: recipientId,
                    type: "INFO",
                    title: `Incoming ${callTypeLabel} Call`,
                    message: `${payload.callerName || "Someone"} is calling you...`,
                    is_read: false,
                    read_at: null,
                    created_at: new Date() as any
                }).catch(() => {});
            }
        });

        socket.on("call:accept", (payload: AcceptCallPayload) => {
            if (!payload || !payload.callerId) return;
            this._io.to(`user:${String(payload.callerId).trim()}`).emit("call:accepted", {
                calleeId: normalizedUserId,
                roomName: payload.roomName
            });
        });

        socket.on("call:reject", (payload: RejectCallPayload) => {
            if (!payload || !payload.callerId) return;
            this._io.to(`user:${String(payload.callerId).trim()}`).emit("call:rejected", {
                calleeId: normalizedUserId,
                roomName: payload.roomName,
                reason: payload.reason || "declined"
            });
        });

        socket.on("call:end", (payload: EndCallPayload) => {
            if (!payload || !payload.targetUserId) return;
            this._io.to(`user:${String(payload.targetUserId).trim()}`).emit("call:ended", {
                userId: normalizedUserId,
                roomName: payload.roomName
            });
        });
    }
}

