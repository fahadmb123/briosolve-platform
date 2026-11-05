import { useEffect } from "react";
import { socket } from "../../../shared/api/socket-client";
import { useAuthStore } from "../../auth/stores/auth.store";
import type { BackendMessageDto } from "../services/chat.service";

interface UseChatSocketProps {
    conversationId: string | null;
    onNewMessage: (message: BackendMessageDto) => void;
    onConversationRead?: (data: { conversation_id: string; read_by: string; read_at: string }) => void;
}

export function useChatSocket({ conversationId, onNewMessage, onConversationRead }: UseChatSocketProps): void {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) return;

        if (!socket.connected) {
            socket.connect();
        }

        const handleNewMessage = (message: BackendMessageDto) => {
            onNewMessage(message);
        };

        const handleConversationRead = (data: { conversation_id: string; read_by: string; read_at: string }) => {
            if (onConversationRead) {
                onConversationRead(data);
            }
        };

        socket.on("message:new", handleNewMessage);
        socket.on("conversation:read", handleConversationRead);

        return () => {
            socket.off("message:new", handleNewMessage);
            socket.off("conversation:read", handleConversationRead);
        };
    }, [isAuthenticated, onNewMessage, onConversationRead]);

    useEffect(() => {
        if (!isAuthenticated || !conversationId) return;

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("conversation:join", conversationId);
    }, [isAuthenticated, conversationId]);
}

