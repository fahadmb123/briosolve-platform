import { useEffect } from "react";
import { socket } from "../../../shared/api/socket-client";
import { useAuthStore } from "../../auth/stores/auth.store";
import type { BackendMessageDto } from "../services/chat.service";

interface UseChatSocketProps {
    conversationId: string | null;
    onNewMessage: (message: BackendMessageDto) => void;
}

export function useChatSocket({ conversationId, onNewMessage }: UseChatSocketProps): void {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated || !conversationId) return;

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("conversation:join", conversationId);

        const handleNewMessage = (message: BackendMessageDto) => {
            if (message.conversation_id === conversationId) {
                onNewMessage(message);
            }
        };

        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off("message:new", handleNewMessage);
        };
    }, [isAuthenticated, conversationId, onNewMessage]);
}

