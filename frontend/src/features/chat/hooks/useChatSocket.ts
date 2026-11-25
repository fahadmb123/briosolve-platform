import { useEffect, useRef } from "react";
import { socket } from "../../../shared/api/socket-client";
import { useAuthStore } from "../../auth/stores/auth.store";
import type { BackendMessageDto } from "../services/chat.service";

interface UseChatSocketProps {
    conversationId: string | null;
    onNewMessage: (message: BackendMessageDto) => void;
    onConversationRead?: (data: { conversation_id: string; read_by: string; read_at: string }) => void;
    onUserStatus?: (data: { userId: string; isOnline: boolean }) => void;
    onTypingStart?: (data: { conversationId: string; userId: string }) => void;
    onTypingStop?: (data: { conversationId: string; userId: string }) => void;
}

export function useChatSocket({
    conversationId,
    onNewMessage,
    onConversationRead,
    onUserStatus,
    onTypingStart,
    onTypingStop,
}: UseChatSocketProps): void {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const onNewMessageRef = useRef(onNewMessage);
    const onConversationReadRef = useRef(onConversationRead);
    const onUserStatusRef = useRef(onUserStatus);
    const onTypingStartRef = useRef(onTypingStart);
    const onTypingStopRef = useRef(onTypingStop);

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
        onTypingStartRef.current = onTypingStart;
    });

    useEffect(() => {
        onTypingStopRef.current = onTypingStop;
    });

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

        const handleTypingStart = (data: { conversationId: string; userId: string }) => {
            onTypingStartRef.current?.(data);
        };

        const handleTypingStop = (data: { conversationId: string; userId: string }) => {
            onTypingStopRef.current?.(data);
        };

        socket.on("message:new", handleNewMessage);
        socket.on("conversation:read", handleConversationRead);
        socket.on("user:status", handleUserStatus);
        socket.on("typing:start", handleTypingStart);
        socket.on("typing:stop", handleTypingStop);

        return () => {
            socket.off("message:new", handleNewMessage);
            socket.off("conversation:read", handleConversationRead);
            socket.off("user:status", handleUserStatus);
            socket.off("typing:start", handleTypingStart);
            socket.off("typing:stop", handleTypingStop);
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
