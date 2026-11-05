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
  ChatMessageListSkeleton,
  ChatThreadSkeleton,
} from "../../components";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { type BackendMessageDto } from "../../services/chat.service";
import {
  useGetConversations,
  useGetMessages,
  useSendMessage,
  useMarkMessagesAsRead,
  useStartConversation,
} from "../../hooks/useChatMutations";
import { toChatMessage, toChatConversation } from "../../utils/chat.mapper";
import { useChatSocket } from "../../hooks/useChatSocket";
import "./CustomerChat.css";

export default function CustomerChat() {
  const currentUser = useAuthStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const queryConversationId =
    searchParams.get("conversationId") ||
    (location.state as { conversationId?: string })?.conversationId ||
    null;
  const queryRecipientId =
    searchParams.get("recipientId") ||
    (location.state as { recipientId?: string; providerId?: string })?.recipientId ||
    (location.state as { providerId?: string })?.providerId ||
    null;

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(
    queryConversationId || queryRecipientId || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<ConversationFilter>("ALL");
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(
    {}
  );
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(
    Boolean(queryConversationId || queryRecipientId)
  );

  const getConversationsMutation = useGetConversations();
  const getMessagesMutation = useGetMessages();
  const sendMessageMutation = useSendMessage();
  const markMessagesAsReadMutation = useMarkMessagesAsRead();
  const startConversationMutation = useStartConversation();

  const fetchConversations = useCallback(() => {
    getConversationsMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (res?.data && res.data.length > 0) {
          const mapped = res.data.map((c) => toChatConversation(c));
          setConversations(mapped);
          setSelectedId((curr) => {
            if (curr && mapped.some((m) => m.id === curr)) return curr;
            if (queryRecipientId) {
              const matched = mapped.find(
                (m) => m.participant.id === queryRecipientId
              );
              if (matched) return matched.id;
              return queryRecipientId;
            }
            if (queryConversationId) return queryConversationId;
            return null;
          });
        } else if (queryRecipientId) {
          setSelectedId(queryRecipientId);
        } else if (queryConversationId) {
          setSelectedId(queryConversationId);
        }
      },
    });
  }, [queryConversationId, queryRecipientId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    (() => {
      if (queryRecipientId) {
        const matched = conversations.find(
          (m) => m.participant.id === queryRecipientId
        );
        if (matched) {
          setSelectedId(matched.id);
        } else {
          setSelectedId(queryRecipientId);
        }
        setIsMobileThreadOpen(true);
      } else if (queryConversationId) {
        setSelectedId(queryConversationId);
        setIsMobileThreadOpen(true);
      }
    })()
  }, [queryConversationId, queryRecipientId, conversations]);

  const selectedConversation = useMemo(() => {
    const existing = conversations.find((c) => c.id === selectedId);
    if (existing) return existing;
    if (selectedId) {
      const locState = location.state as {
        recipientId?: string;
        providerId?: string;
        recipientName?: string;
        providerName?: string;
        recipientAvatar?: string;
        providerAvatar?: string;
        requestTitle?: string;
        requestId?: string;
        categoryName?: string;
        urgency?: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
        budgetType?: "FIXED" | "OPEN_BID";
        budgetAmount?: number;
        location?: string;
      } | null;

      const recipientId =
        locState?.recipientId || locState?.providerId || selectedId;
      const recipientName =
        locState?.recipientName || locState?.providerName || "Provider";

      return {
        id: selectedId,
        participant: {
          id: recipientId,
          name: recipientName,
          role: "PROVIDER" as const,
          avatar: locState?.recipientAvatar || locState?.providerAvatar,
          rating: 5.0,
          reviewsCount: 0,
          isVerified: true,
          isOnline: true,
        },
        linkedRequest: {
          id: locState?.requestId || "req-active",
          title: locState?.requestTitle || "Service Request",
          categoryName: locState?.categoryName || "Services",
          urgency: locState?.urgency || ("FLEXIBLE" as const),
          budgetType: locState?.budgetType || ("OPEN_BID" as const),
          budgetAmount: locState?.budgetAmount,
          status: "ACTIVE" as const,
          location: locState?.location || "Service Location",
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

  const isRealConversation = Boolean(
    selectedId && conversations.some((c) => c.id === selectedId)
  );

  useChatSocket({
    conversationId: isRealConversation ? selectedId : null,
    onNewMessage: handleSocketNewMessage,
  });

  useEffect(() => {
    if (!selectedId || !conversations.some((c) => c.id === selectedId)) return;

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
  }, [selectedId, currentUser?.id, conversations]);

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
    const trimmed = text.trim();
    if (!selectedId || !trimmed) return;

    const isExisting = conversations.some((c) => c.id === selectedId);

    if (isExisting) {
      const tempId = `temp-${Date.now()}`;
      const optimisticMsg: ChatMessage = {
        id: tempId,
        conversationId: selectedId,
        senderId: currentUser?.id || "cust-current",
        senderRole: "CUSTOMER",
        senderName: "You",
        text: trimmed,
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
            content: trimmed,
            messageType: "TEXT",
          },
        },
        {
          onSuccess: (res) => {
            if (res?.data) {
              const confirmedMsg = toChatMessage(
                res.data,
                currentUser?.id
              );
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
                text: trimmed,
                senderId: currentUser?.id || "cust-current",
                createdAt: optimisticMsg.createdAt,
                isUnread: false,
              },
              updatedAt: new Date().toISOString(),
            }
            : c
        )
      );
    } else {
      const targetRecipientId =
        selectedConversation?.participant?.id || queryRecipientId;
      if (!targetRecipientId) {
        toast.error("Recipient details not available");
        return;
      }

      startConversationMutation.mutate(targetRecipientId, {
        onSuccess: (convRes) => {
          if (!convRes?.data?.id) {
            toast.error("Failed to start conversation");
            return;
          }

          const newConvId = convRes.data.id;
          const newConv = toChatConversation(
            convRes.data,
            selectedConversation?.participant,
            selectedConversation?.linkedRequest
          );

          setConversations((prev) => [
            newConv,
            ...prev.filter((c) => c.id !== newConvId),
          ]);
          setSelectedId(newConvId);

          const tempId = `temp-${Date.now()}`;
          const optimisticMsg: ChatMessage = {
            id: tempId,
            conversationId: newConvId,
            senderId: currentUser?.id || "cust-current",
            senderRole: "CUSTOMER",
            senderName: "You",
            text: trimmed,
            type: "TEXT",
            status: "SENDING",
            createdAt: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          setMessagesMap((prev) => ({
            ...prev,
            [newConvId]: [optimisticMsg],
          }));

          sendMessageMutation.mutate(
            {
              conversationId: newConvId,
              payload: {
                content: trimmed,
                messageType: "TEXT",
              },
            },
            {
              onSuccess: (res) => {
                if (res?.data) {
                  const confirmedMsg = toChatMessage(
                    res.data,
                    currentUser?.id
                  );
                  setMessagesMap((prev) => ({
                    ...prev,
                    [newConvId]: (prev[newConvId] || []).map((m) =>
                      m.id === tempId ? confirmedMsg : m
                    ),
                  }));
                }
              },
              onError: () => {
                setMessagesMap((prev) => ({
                  ...prev,
                  [newConvId]: (prev[newConvId] || []).filter(
                    (m) => m.id !== tempId
                  ),
                }));
              },
            }
          );
        },
        onError: (err) => {
          toast.error(err.message || "Failed to start conversation");
        },
      });
    }
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

  const isConversationsLoading =
    getConversationsMutation.isPending && conversations.length === 0;
  const isMessagesLoading =
    getMessagesMutation.isPending &&
    Boolean(
      selectedId &&
      (!messagesMap[selectedId] || messagesMap[selectedId].length === 0) &&
      conversations.some((c) => c.id === selectedId)
    );

  return (
    <div className="chat-layout-root">
      <div
        className={`chat-container-card ${isMobileThreadOpen ? "mobile-thread-open" : "mobile-list-open"
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
            isLoading={isConversationsLoading}
          />
        </div>

        <div className="chat-main-pane">
          {isConversationsLoading && !selectedConversation ? (
            <ChatThreadSkeleton />
          ) : selectedConversation ? (
            <div className="chat-thread-view">
              <ChatHeader
                participant={selectedConversation.participant}
                linkedRequest={selectedConversation.linkedRequest}
                currentRole="CUSTOMER"
                isInfoOpen={isInfoOpen}
                onToggleInfo={() => setIsInfoOpen((prev) => !prev)}
                onBackToMobileList={() => setIsMobileThreadOpen(false)}
              />

              <ChatRequestBanner
                request={selectedConversation.linkedRequest}
                currentRole="CUSTOMER"
                onOpenDetails={() => setIsInfoOpen(true)}
              />

              <div className="chat-thread-body">
                {isMessagesLoading ? (
                  <ChatMessageListSkeleton />
                ) : (
                  <ChatMessageList
                    messages={activeMessages}
                    currentRole="CUSTOMER"
                    currentUserId={currentUser?.id}
                    onAcceptQuote={handleAcceptQuote}
                    onDeclineQuote={handleDeclineQuote}
                  />
                )}
              </div>

              <ChatInputBar onSendMessage={handleSendMessage} />
            </div>
          ) : (
            <EmptyChatState currentRole="CUSTOMER" />
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
