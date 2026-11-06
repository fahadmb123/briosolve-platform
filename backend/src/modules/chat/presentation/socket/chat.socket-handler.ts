import type { Socket } from "socket.io";
import { JoinConversationUseCase } from "../../application/use-cases/joinConversation.useCase";
import type { SocketData } from "../../../../shared/realtime/types/socket-data.types";

export class ChatSocketHandler {
    constructor(
        private readonly _joinConversationUseCase: JoinConversationUseCase
    ) {}

    register(socket: Socket<any, any, any, SocketData>): void {
        socket.on("conversation:join", async (conversationId: string) => {
            try {
                const userId = socket.data.user?.userId ?? (socket.data as any)?.userId;

                if (!userId) {
                    socket.emit("conversation:error", {
                        message: "Authentication required"
                    });
                    return;
                }

                await this._joinConversationUseCase.execute({
                    conversationId,
                    userId
                });

                await socket.join(`conversation:${conversationId}`);

                socket.emit("conversation:joined", {
                    conversationId
                });
            } catch (error: any) {
                socket.emit("conversation:error", {
                    message: error instanceof Error
                        ? error.message
                        : "Unable to join conversation"
                });
            }
        });

        socket.on("conversation:leave", async (conversationId: string) => {
            await socket.leave(`conversation:${conversationId}`);
        });
    }
}
