import { useState, useMemo, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES_MAP,
} from "../../data/mockChatData";
import type {
  ChatConversation,
  ChatMessage,
  ConversationFilter,
} from "../../types/chat.types";
import {
  ConversationList,
  ChatHeader,
  ChatRequestBanner,
  ChatMessageList,
  ChatInputBar,
  ChatInfoDrawer,
  EmptyChatState,
} from "../../components";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { type BackendMessageDto } from "../../services/chat.service";
import {
  useGetMessages,
  useSendMessage,
  useMarkMessagesAsRead,
} from "../../hooks/useChat";
import { toChatMessage } from "../../utils/chat.mapper";
import { useChatSocket } from "../../hooks/useChatSocket";
import "./CustomerChat.css";

export default function CustomerChat() {
  const currentUser = useAuthStore((state) => state.user);
  const [conversations, setConversations] =
    useState<ChatConversation[]>(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string | null>("conv-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<ConversationFilter>("ALL");
  const [messagesMap, setMessagesMap] =
    useState<Record<string, ChatMessage[]>>(MOCK_MESSAGES_MAP);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(false);

  const getMessagesMutation = useGetMessages();
  const sendMessageMutation = useSendMessage();
  const markMessagesAsReadMutation = useMarkMessagesAsRead();

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedId) || null;
  }, [conversations, selectedId]);

  const activeMessages = useMemo(() => {
    if (!selectedId) return [];
    return messagesMap[selectedId] || [];
  }, [messagesMap, selectedId]);

  const handleSocketNewMessage = useCallback(
    (backendMsg: BackendMessageDto) => {
      const chatMsg = toChatMessage(backendMsg, currentUser?.id);

      setMessagesMap((prev) => {
        const existing = prev[backendMsg.conversation_id] || [];
        if (existing.some((m) => m.id === chatMsg.id)) {
          return prev;
        }
        return {
          ...prev,
          [backendMsg.conversation_id]: [...existing, chatMsg],
        };
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === backendMsg.conversation_id
            ? {
                ...c,
                lastMessage: {
                  text: backendMsg.content,
                  senderId: backendMsg.sender_id,
                  createdAt: chatMsg.createdAt,
                  isUnread: backendMsg.sender_id !== currentUser?.id,
                },
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
    },
    [currentUser?.id]
  );

  useChatSocket({
    conversationId: selectedId,
    onNewMessage: handleSocketNewMessage,
  });

  useEffect(() => {
    if (!selectedId) return;

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        selectedId
      );
    if (!isUuid) return;

    getMessagesMutation.mutate(
      { conversationId: selectedId },
      {
        onSuccess: (res) => {
          if (res.data) {
            const mapped = res.data.map((msg) =>
              toChatMessage(msg, currentUser?.id)
            );
            setMessagesMap((prev) => ({
              ...prev,
              [selectedId]: mapped,
            }));
          }
        },
      }
    );

    markMessagesAsReadMutation.mutate(selectedId);
  }, [selectedId, currentUser?.id]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      if (filter === "UNREAD" && conv.unreadCount === 0) return false;
      if (filter === "QUOTES" && !conv.hasActiveQuote) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = conv.participant.name.toLowerCase().includes(q);
        const bizMatch = (conv.participant.businessName || "")
          .toLowerCase()
          .includes(q);
        const requestMatch = conv.linkedRequest.title.toLowerCase().includes(q);
        const msgMatch = conv.lastMessage.text.toLowerCase().includes(q);
        return nameMatch || bizMatch || requestMatch || msgMatch;
      }
      return true;
    });
  }, [conversations, filter, searchQuery]);

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setIsMobileThreadOpen(true);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              unreadCount: 0,
              lastMessage: { ...c.lastMessage, isUnread: false },
            }
          : c
      )
    );
  };

  const handleSendMessage = (text: string) => {
    if (!selectedId || !text.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      conversationId: selectedId,
      senderId: currentUser?.id || "cust-current",
      senderRole: "CUSTOMER",
      senderName: "You",
      text: text.trim(),
      type: "TEXT",
      status: "SENDING",
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), optimisticMsg],
    }));

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        selectedId
      );

    if (isUuid) {
      sendMessageMutation.mutate(
        {
          conversationId: selectedId,
          payload: {
            content: text.trim(),
            messageType: "TEXT",
          },
        },
        {
          onSuccess: (res) => {
            if (res.data) {
              const confirmedMsg = toChatMessage(res.data, currentUser?.id);
              setMessagesMap((prev) => ({
                ...prev,
                [selectedId]: (prev[selectedId] || []).map((m) =>
                  m.id === tempId ? confirmedMsg : m
                ),
              }));
            }
          },
          onError: () => {
            setMessagesMap((prev) => ({
              ...prev,
              [selectedId]: (prev[selectedId] || []).filter(
                (m) => m.id !== tempId
              ),
            }));
          },
        }
      );
    } else {
      setMessagesMap((prev) => ({
        ...prev,
        [selectedId]: (prev[selectedId] || []).map((m) =>
          m.id === tempId ? { ...m, status: "SENT" } : m
        ),
      }));
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              lastMessage: {
                text: text.trim(),
                senderId: currentUser?.id || "cust-current",
                createdAt: optimisticMsg.createdAt,
                isUnread: false,
              },
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const handleAcceptQuote = (quoteId: string) => {
    if (!selectedId) return;

    setMessagesMap((prev) => ({
      ...prev,
      [selectedId]: (prev[selectedId] || []).map((msg) =>
        msg.type === "QUOTE" && msg.quotePayload?.quoteId === quoteId
          ? {
              ...msg,
              quotePayload: {
                ...msg.quotePayload,
                status: "ACCEPTED",
              },
            }
          : msg
      ),
    }));

    toast.success("Quotation accepted! Provider has been notified.");
  };

  const handleDeclineQuote = (quoteId: string) => {
    if (!selectedId) return;

    setMessagesMap((prev) => ({
      ...prev,
      [selectedId]: (prev[selectedId] || []).map((msg) =>
        msg.type === "QUOTE" && msg.quotePayload?.quoteId === quoteId
          ? {
              ...msg,
              quotePayload: {
                ...msg.quotePayload,
                status: "DECLINED",
              },
            }
          : msg
      ),
    }));

    toast("Quotation declined.");
  };

  return (
    <div className="chat-layout-root">
      <div
        className={`chat-container-card ${
          isMobileThreadOpen ? "mobile-thread-open" : "mobile-list-open"
        }`}
      >
        <div className="chat-left-pane">
          <ConversationList
            conversations={filteredConversations}
            selectedId={selectedId}
            onSelect={handleSelectConversation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>

        <div className="chat-main-pane">
          {selectedConversation ? (
            <div className="chat-thread-view">
              <ChatHeader
                participant={selectedConversation.participant}
                linkedRequest={selectedConversation.linkedRequest}
                isInfoOpen={isInfoOpen}
                onToggleInfo={() => setIsInfoOpen((prev) => !prev)}
                onBackToMobileList={() => setIsMobileThreadOpen(false)}
              />

              <ChatRequestBanner
                request={selectedConversation.linkedRequest}
                onOpenDetails={() => setIsInfoOpen(true)}
              />

              <div className="chat-thread-body">
                <ChatMessageList
                  messages={activeMessages}
                  onAcceptQuote={handleAcceptQuote}
                  onDeclineQuote={handleDeclineQuote}
                />
              </div>

              <ChatInputBar onSendMessage={handleSendMessage} />
            </div>
          ) : (
            <EmptyChatState />
          )}
        </div>

        {selectedConversation && (
          <div className={`chat-info-pane ${isInfoOpen ? "open" : ""}`}>
            <ChatInfoDrawer
              participant={selectedConversation.participant}
              linkedRequest={selectedConversation.linkedRequest}
              isOpen={isInfoOpen}
              onClose={() => setIsInfoOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
