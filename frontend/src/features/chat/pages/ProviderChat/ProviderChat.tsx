import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
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
  CreateQuoteModal,
} from "../../components";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { type BackendMessageDto } from "../../services/chat.service";
import {
  useGetConversations,
  useGetMessages,
  useSendMessage,
  useMarkMessagesAsRead,
} from "../../hooks/useChatMutations";
import { toChatMessage, toChatConversation } from "../../utils/chat.mapper";
import { useChatSocket } from "../../hooks/useChatSocket";
import "../CustomerChat/CustomerChat.css";

export default function ProviderChat() {
  const currentUser = useAuthStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const queryConversationId =
    searchParams.get("conversationId") ||
    (location.state as { conversationId?: string })?.conversationId ||
    null;

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    queryConversationId || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<ConversationFilter>("ALL");
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(
    {}
  );
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(
    Boolean(queryConversationId)
  );
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const getConversationsMutation = useGetConversations();
  const getMessagesMutation = useGetMessages();
  const sendMessageMutation = useSendMessage();
  const markMessagesAsReadMutation = useMarkMessagesAsRead();

  useEffect(() => {
    if (queryConversationId) {
      setSelectedId(queryConversationId);
      setIsMobileThreadOpen(true);
    }
  }, [queryConversationId]);

  const fetchConversations = useCallback(() => {
    getConversationsMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (res?.data && res.data.length > 0) {
          const mapped = res.data.map((c) => toChatConversation(c));
          setConversations(mapped);
          setSelectedId((curr) => {
            if (curr && mapped.some((m) => m.id === curr)) return curr;
            if (queryConversationId) return queryConversationId;
            return mapped[0].id;
          });
        } else if (queryConversationId) {
          setSelectedId(queryConversationId);
        }
      },
    });
  }, [queryConversationId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const selectedConversation = useMemo(() => {
    const existing = conversations.find((c) => c.id === selectedId);
    if (existing) return existing;
    if (selectedId) {
      const locState = location.state as {
        customerId?: string;
        requestTitle?: string;
      } | null;
      return {
        id: selectedId,
        participant: {
          id: locState?.customerId || selectedId,
          name: "Customer",
          role: "CUSTOMER" as const,
          rating: 5.0,
          reviewsCount: 0,
          isVerified: true,
          isOnline: true,
        },
        linkedRequest: {
          id: "req-active",
          title: locState?.requestTitle || "Service Request",
          categoryName: "Services",
          urgency: "FLEXIBLE" as const,
          budgetType: "OPEN_BID" as const,
          status: "ACTIVE" as const,
          location: "Client Area",
        },
        lastMessage: {
          text: "",
          senderId: "",
          createdAt: "",
          isUnread: false,
        },
        unreadCount: 0,
        hasActiveQuote: false,
        updatedAt: new Date().toISOString(),
      };
    }
    return null;
  }, [conversations, selectedId, location.state]);

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

    getMessagesMutation.mutate(
      { conversationId: selectedId },
      {
        onSuccess: (res) => {
          if (res?.data) {
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
        const requestMatch = conv.linkedRequest.title.toLowerCase().includes(q);
        const msgMatch = conv.lastMessage.text.toLowerCase().includes(q);
        const locationMatch = conv.linkedRequest.location.toLowerCase().includes(q);
        return nameMatch || requestMatch || msgMatch || locationMatch;
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

    const tempId = `pmsg-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      conversationId: selectedId,
      senderId: currentUser?.id || "prov-current",
      senderRole: "PROVIDER",
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
          if (res?.data) {
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

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              lastMessage: {
                text: text.trim(),
                senderId: currentUser?.id || "prov-current",
                createdAt: optimisticMsg.createdAt,
                isUnread: false,
              },
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );
  };

  const handleCreateQuote = (payload: {
    amount: number;
    durationHours: number;
    includesParts: boolean;
    notes: string;
  }) => {
    if (!selectedId) return;

    const newQuoteMessage: ChatMessage = {
      id: `pmsg-quote-${Date.now()}`,
      conversationId: selectedId,
      senderId: currentUser?.id || "prov-current",
      senderRole: "PROVIDER",
      senderName: "You",
      text: "Submitted a formal quotation for your request.",
      type: "QUOTE",
      status: "SENT",
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      quotePayload: {
        quoteId: `quote-${Date.now()}`,
        requestId: selectedConversation?.linkedRequest.id || "req-active",
        requestTitle:
          selectedConversation?.linkedRequest.title || "Service Request",
        amount: payload.amount,
        durationHours: payload.durationHours,
        includesParts: payload.includesParts,
        notes: payload.notes,
        status: "PENDING",
      },
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newQuoteMessage],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              hasActiveQuote: true,
              lastMessage: {
                text: `Quotation: $${payload.amount}`,
                senderId: currentUser?.id || "prov-current",
                createdAt: newQuoteMessage.createdAt,
                isUnread: false,
              },
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    setIsQuoteModalOpen(false);
    toast.success("Quote generated and sent to customer!");
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
                  onAcceptQuote={() => {}}
                  onDeclineQuote={() => {}}
                />
              </div>

              <div className="provider-quick-prompts-bar">
                <button
                  type="button"
                  className="provider-prompt-pill"
                  onClick={() => setIsQuoteModalOpen(true)}
                >
                  Create Quotation
                </button>
              </div>

              <ChatInputBar onSendMessage={handleSendMessage} />
            </div>
          ) : (
            <EmptyChatState currentRole="PROVIDER" />
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

      {selectedConversation && (
        <CreateQuoteModal
          isOpen={isQuoteModalOpen}
          participant={selectedConversation.participant}
          linkedRequest={selectedConversation.linkedRequest}
          onClose={() => setIsQuoteModalOpen(false)}
          onSubmitQuote={handleCreateQuote}
        />
      )}
    </div>
  );
}
