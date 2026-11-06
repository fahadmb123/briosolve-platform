import { useEffect, useCallback } from "react";
import { socket } from "../../../shared/api/socket-client";
import { useAuthStore } from "../../auth/stores/auth.store";
import { useChatStore } from "../stores/chat.store";
import { getConversations, type BackendMessageDto } from "../services/chat.service";
import { playMessageSound } from "../utils/sound.utils";

let lastFetchTime = 0;
let inflightPromise: Promise<void> | null = null;

export async function refreshGlobalUnreadCount(): Promise<void> {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) return;

    if (inflightPromise) return inflightPromise;

    inflightPromise = (async () => {
        try {
            lastFetchTime = Date.now();
            const res = await getConversations();
            if (res?.data) {
                const total = res.data.reduce(
                    (acc, conv) => acc + (conv.unread_count || 0),
                    0
                );
                useChatStore.getState().setUnreadCount(total);
            }
        } catch {
            (() => {})();
        } finally {
            inflightPromise = null;
        }
    })();

    return inflightPromise;
}

export function useChatUnreadSync(): void {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const currentUserId = useAuthStore((state) => state.user?.id);

    const triggerRefresh = useCallback(() => {
        const now = Date.now();
        if (now - lastFetchTime < 1000) return;
        refreshGlobalUnreadCount();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        triggerRefresh();

        window.addEventListener("popstate", triggerRefresh);
        return () => {
            window.removeEventListener("popstate", triggerRefresh);
        };
    }, [isAuthenticated, triggerRefresh]);

    useEffect(() => {
        if (!isAuthenticated) return;

        if (!socket.connected) {
            socket.connect();
        }

        const handleNewMessage = (msg: BackendMessageDto) => {
            const authUser = useAuthStore.getState().user;
            if (authUser?.id && String(msg.sender_id).trim() === String(authUser.id).trim()) {
                return;
            }

            const activeConversationId = useChatStore.getState().activeConversationId;
            if (activeConversationId && String(activeConversationId).trim() === String(msg.conversation_id).trim()) {
                return;
            }

            playMessageSound();
            useChatStore.getState().incrementUnreadCount(1);
            lastFetchTime = 0;
            refreshGlobalUnreadCount();
        };

        const handleConversationRead = () => {
            lastFetchTime = 0;
            refreshGlobalUnreadCount();
        };

        const handleWindowRefresh = () => {
            lastFetchTime = 0;
            refreshGlobalUnreadCount();
        };

        socket.on("message:new", handleNewMessage);
        socket.on("conversation:read", handleConversationRead);
        window.addEventListener("chat:unread-refresh", handleWindowRefresh);

        return () => {
            socket.off("message:new", handleNewMessage);
            socket.off("conversation:read", handleConversationRead);
            window.removeEventListener("chat:unread-refresh", handleWindowRefresh);
        };
    }, [isAuthenticated, currentUserId]);
}

export function useUnreadChatCount(): number {
    return useChatStore((state) => state.unreadCount);
}
