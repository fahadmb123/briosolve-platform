import { create } from "zustand";

interface ChatStoreState {
    unreadCount: number;
    activeConversationId: string | null;
    setActiveConversationId: (id: string | null) => void;
    setUnreadCount: (count: number) => void;
    incrementUnreadCount: (amount?: number) => void;
    decrementUnreadCount: (amount?: number) => void;
}

export const useChatStore = create<ChatStoreState>()((set) => ({
    unreadCount: 0,
    activeConversationId: null,
    setActiveConversationId: (id) => set({ activeConversationId: id }),
    setUnreadCount: (count) => set({ unreadCount: Math.max(0, count) }),
    incrementUnreadCount: (amount = 1) =>
        set((state) => ({ unreadCount: state.unreadCount + amount })),
    decrementUnreadCount: (amount = 1) =>
        set((state) => ({ unreadCount: Math.max(0, state.unreadCount - amount) })),
}));
