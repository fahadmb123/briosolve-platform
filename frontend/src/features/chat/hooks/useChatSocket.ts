import { useEffect } from "react";
import { socket } from "../../../shared/api/socket-client";
import { useAuthStore } from "../../auth/stores/auth.store";
import type { BackendMessageDto } from "../services/chat.service";

interface UseChatSocketProps {
    conversationId: string | null;
    onNewMessage: (message: BackendMessageDto) => void;
    onConversationRead?: (data: { conversation_id: string; read_by: string; read_at: string }) => void;
    onUserStatus?: (data: { userId: string; isOnline: boolean }) => void;
}

export function useChatSocket({
    conversationId,
    onNewMessage,
    onConversationRead,
    onUserStatus,
}: UseChatSocketProps): void {
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

        const handleUserStatus = (data: { userId: string; isOnline: boolean }) => {
            if (onUserStatus) {
                onUserStatus(data);
            }
        };

        const handleConnect = () => {
            socket.emit("chat:presence:enter");
        };

        socket.on("message:new", handleNewMessage);
        socket.on("conversation:read", handleConversationRead);
        socket.on("user:status", handleUserStatus);
        socket.on("connect", handleConnect);

        socket.emit("chat:presence:enter");

        return () => {
            socket.emit("chat:presence:leave");
            socket.off("message:new", handleNewMessage);
            socket.off("conversation:read", handleConversationRead);
            socket.off("user:status", handleUserStatus);
            socket.off("connect", handleConnect);
        };
    }, [isAuthenticated, onNewMessage, onConversationRead, onUserStatus]);

    useEffect(() => {
        if (!isAuthenticated || !conversationId) return;

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("conversation:join", conversationId);

        return () => {
            socket.emit("conversation:leave", conversationId);
        };
    }, [isAuthenticated, conversationId]);
}
