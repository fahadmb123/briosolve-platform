import { useEffect, useRef } from "react";
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

    const onNewMessageRef = useRef(onNewMessage);
    const onConversationReadRef = useRef(onConversationRead);
    const onUserStatusRef = useRef(onUserStatus);

    useEffect(() => {
        onNewMessageRef.current = onNewMessage;
    });

    useEffect(() => {
        onConversationReadRef.current = onConversationRead;
    });

    useEffect(() => {
        onUserStatusRef.current = onUserStatus;
    });

    useEffect(() => {
        if (!isAuthenticated) return;

        if (!socket.connected) {
            socket.connect();
        }

        const handleConnect = () => {
            socket.emit("chat:presence:enter");
        };

        socket.on("connect", handleConnect);
        socket.emit("chat:presence:enter");

        return () => {
            socket.emit("chat:presence:leave");
            socket.off("connect", handleConnect);
        };
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) return;

        if (!socket.connected) {
            socket.connect();
        }

        const handleNewMessage = (message: BackendMessageDto) => {
            onNewMessageRef.current?.(message);
        };

        const handleConversationRead = (data: { conversation_id: string; read_by: string; read_at: string }) => {
            onConversationReadRef.current?.(data);
        };

        const handleUserStatus = (data: { userId: string; isOnline: boolean }) => {
            onUserStatusRef.current?.(data);
        };

        socket.on("message:new", handleNewMessage);
        socket.on("conversation:read", handleConversationRead);
        socket.on("user:status", handleUserStatus);

        return () => {
            socket.off("message:new", handleNewMessage);
            socket.off("conversation:read", handleConversationRead);
            socket.off("user:status", handleUserStatus);
        };
    }, [isAuthenticated]);

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
