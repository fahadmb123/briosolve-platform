import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import type { IJwtService } from "../../interfaces/jwtDto.service";
import { envConfig } from "../../config/env.config";
import { createSocketAuthMiddleware } from "../middleware/socket-auth.middleware";
import { chatSocketHandler } from "../../../modules/chat/infrastructure/composition/socket";
import { PresenceTracker } from "../services/presence.tracker";
import { CallSocketHandler } from "../../../modules/communication/presentation/socket/call.socket-handler";

export function createSocketServer(httpServer: HttpServer, jwtService: IJwtService) {
    const io = new Server(httpServer, {
        cors: {
            origin: envConfig.CORS_ORIGIN,
            credentials: true,
        },
    });

    const callSocketHandler = new CallSocketHandler(io);

    io.use(createSocketAuthMiddleware(jwtService));

    io.on("connection", (socket) => {
        const { userId } = socket.data.user;
        const normalizedUserId = String(userId).trim();

        socket.join(`user:${normalizedUserId}`);
        chatSocketHandler.register(socket);
        callSocketHandler.register(socket);

        socket.on("chat:presence:enter", () => {
            const becameOnline = PresenceTracker.add(normalizedUserId, socket.id);
            if (becameOnline) {
                io.emit("user:status", { userId: normalizedUserId, isOnline: true });
            }
        });

        socket.on("chat:presence:leave", () => {
            const becameOffline = PresenceTracker.remove(normalizedUserId, socket.id);
            if (becameOffline) {
                io.emit("user:status", { userId: normalizedUserId, isOnline: false });
            }
        });

        socket.on("disconnect", () => {
            const becameOffline = PresenceTracker.remove(normalizedUserId, socket.id);
            if (becameOffline) {
                io.emit("user:status", { userId: normalizedUserId, isOnline: false });
            }
        });

        socket.on("user:check_online", (targetUserId: string, callback?: (isOnline: boolean) => void) => {
            const isOnline = PresenceTracker.isOnline(String(targetUserId).trim());
            if (typeof callback === "function") {
                callback(isOnline);
            } else {
                socket.emit("user:status", { userId: targetUserId, isOnline });
            }
        });
    });

    return io;
}
