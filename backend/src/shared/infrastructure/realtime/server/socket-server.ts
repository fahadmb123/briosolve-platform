import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import type { IJwtService } from "../../../application/Dto/services/jwtDto.service";
import { envConfig } from "../../config/env.config";
import { createSocketAuthMiddleware } from "../middleware/socket-auth.middleware";


export function createSocketServer(httpServer: HttpServer,jwtService: IJwtService) {
    const io = new Server(httpServer, {
        cors: {
            origin:envConfig.CORS_ORIGIN,
            credentials: true,
        },
    });

    io.use(createSocketAuthMiddleware(jwtService));

    return io
}