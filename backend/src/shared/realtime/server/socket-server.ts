import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import type { IJwtService } from "../../interfaces/jwtDto.service";
import { envConfig } from "../../config/env.config";
import { createSocketAuthMiddleware } from "../middleware/socket-auth.middleware";
import { chatSocketHandler } from "../../../modules/chat/infrastructure/composition/socket";

export function createSocketServer(httpServer: HttpServer, jwtService: IJwtService) {
    const io = new Server(httpServer, {
        cors: {
            origin: envConfig.CORS_ORIGIN,
            credentials: true,
        },
    });

    io.use(createSocketAuthMiddleware(jwtService));

    io.on("connection", (socket) => {
        const { userId } = socket.data.user;

        socket.join(`user:${userId}`);
        chatSocketHandler.register(socket);
    });

    return io;
}
