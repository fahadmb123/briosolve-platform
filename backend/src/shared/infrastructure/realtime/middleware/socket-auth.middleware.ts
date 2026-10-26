import type { Socket } from "socket.io";
import * as cookie from "cookie"
import type { IJwtService } from "../../../application/Dto/services/jwtDto.service";
import { SocketData } from "../types/socket-data.types";


type SocketAuthCallback = (error?: Error) => void;

export function createSocketAuthMiddleware(
    jwtService: IJwtService,
) {
    return (
        socket: Socket<never, never, never, SocketData>,
        next: SocketAuthCallback,
    ): void => {
        try {
            const cookieHeader = socket.handshake.headers.cookie;

            if (!cookieHeader) {
                next(new Error("Authentication required"));
                return;
            }

            const { access_token: accessToken } = cookie.parseCookie(cookieHeader);

            if (!accessToken) {
                next(new Error("Authentication required"));
                return;
            }

            const payload = jwtService.verify(accessToken);

            if (!payload.userId || !payload.role) {
                next(new Error("Invalid authentication"));
                return;
            }

            socket.data.user = {
                userId: payload.userId,
                role: payload.role as "ADMIN" | "CUSTOMER" | "PROVIDER",
            };

            next();
        } catch {
            next(new Error("Invalid or expired authentication"));
        }
    };
}