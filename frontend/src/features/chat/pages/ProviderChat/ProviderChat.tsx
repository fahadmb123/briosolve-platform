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
import { useChatStore } from "../../stores/chat.store";
import { socket } from "../../../../shared/api/socket-client";
import "../CustomerChat/CustomerChat.css";

export default function ProviderChat() {
  const currentUser = useAuthStore((state) => state.user);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const queryConversationId =
    searchParams.get("conversationId") ||
    (location.state as { conversationId?: string })?.conversationId ||
    null;
  const queryRecipientId =
    searchParams.get("recipientId") ||
    (location.state as { recipientId?: string; customerId?: string })?.recipientId ||
    (location.state as { customerId?: string })?.customerId ||
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
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({});

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
          const totalUnread = mapped.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
          useChatStore.getState().setUnreadCount(totalUnread);
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
    (()=>{
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

  useEffect(() => {
    useChatStore.getState().setActiveConversationId(selectedId);
    return () => {
      useChatStore.getState().setActiveConversationId(null);
    };
  }, [selectedId]);

  const selectedConversation = useMemo(() => {
    const existing = conversations.find((c) => c.id === selectedId);
    if (existing) {
      const pId = String(existing.participant.id).trim();
      const isOnline = presenceMap[pId] ?? existing.participant.isOnline ?? false;
      return {
        ...existing,
        participant: {
          ...existing.participant,
          isOnline,
        },
      };
    }
    if (selectedId) {
      const locState = location.state as {
        recipientId?: string;
        customerId?: string;
        recipientName?: string;
        customerName?: string;
        recipientAvatar?: string;
        customerAvatar?: string;
        requestTitle?: string;
        requestId?: string;
        categoryName?: string;
        urgency?: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
        budgetType?: "FIXED" | "OPEN_BID";
        budgetAmount?: number;
        location?: string;
      } | null;

      const recipientId =
        locState?.recipientId || locState?.customerId || selectedId;
      const recipientName =
        locState?.recipientName || locState?.customerName || "Customer";
      const pId = String(recipientId).trim();
      const isOnline = presenceMap[pId] ?? false;

      return {
        id: selectedId,
        participant: {
          id: recipientId,
          name: recipientName,
          role: "CUSTOMER" as const,
          avatar: locState?.recipientAvatar || locState?.customerAvatar,
          rating: 5.0,
          reviewsCount: 0,
          isVerified: true,
          isOnline,
        },
        linkedRequest: {
          id: locState?.requestId || "req-active",
          title: locState?.requestTitle || "Service Request",
          categoryName: locState?.categoryName || "Services",
          urgency: locState?.urgency || ("FLEXIBLE" as const),
          budgetType: locState?.budgetType || ("OPEN_BID" as const),
          budgetAmount: locState?.budgetAmount,
          status: "ACTIVE" as const,
          location: locState?.location || "Client Area",
        },
        lastMessage: {
          text: "",
          senderId: "",
          createdAt: "",
          isUnread: false,
        },
        unreadCount: 0,
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
      const chatMsg = toChatMessage(backendMsg, currentUser?.id, "PROVIDER");

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

      setConversations((prev) => {
        const exists = prev.some((c) => String(c.id).trim() === String(backendMsg.conversation_id).trim());
        if (!exists) {
          fetchConversations();
          return prev;
        }

        const updated = prev
          .map((c) => {
            if (String(c.id).trim() !== String(backendMsg.conversation_id).trim()) return c;
            const isFromOther = String(backendMsg.sender_id).trim() !== String(currentUser?.id).trim();
            const isNotSelected = String(selectedId).trim() !== String(backendMsg.conversation_id).trim();
            return {
              ...c,
              lastMessage: {
                text: backendMsg.content,
                senderId: backendMsg.sender_id,
                createdAt: chatMsg.createdAt,
                isUnread: isFromOther && isNotSelected,
              },
              unreadCount: isFromOther && isNotSelected ? (c.unreadCount || 0) + 1 : c.unreadCount,
              updatedAt: new Date().toISOString(),
            };
          })
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        const totalUnread = updated.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
        useChatStore.getState().setUnreadCount(totalUnread);

        return updated;
      });

      if (String(selectedId).trim() === String(backendMsg.conversation_id).trim() && String(backendMsg.sender_id).trim() !== String(currentUser?.id).trim()) {
        markMessagesAsReadMutation.mutate(backendMsg.conversation_id);
      }
    },
    [currentUser?.id, selectedId, fetchConversations, markMessagesAsReadMutation]
  );

  const handleSocketConversationRead = useCallback(
    (data: { conversation_id: string; read_by: string }) => {
      if (data.read_by === currentUser?.id) return;
      setMessagesMap((prev) => {
        const msgs = prev[data.conversation_id];
        if (!msgs) return prev;
        return {
          ...prev,
          [data.conversation_id]: msgs.map((m) =>
            m.senderId === currentUser?.id ? { ...m, status: "READ" as const } : m
          ),
        };
      });
    },
    [currentUser?.id]
  );

  const handleSocketUserStatus = useCallback(
    ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
      const normalizedUserId = String(userId).trim();
      setPresenceMap((prev) => ({ ...prev, [normalizedUserId]: isOnline }));
      setConversations((prev) =>
        prev.map((c) =>
          String(c.participant.id).trim() === normalizedUserId
            ? { ...c, participant: { ...c.participant, isOnline } }
            : c
        )
      );
    },
    []
  );

  useEffect(() => {
    const participantId = selectedConversation?.participant?.id;
    if (!participantId) return;
    const targetId = String(participantId).trim();
    socket.emit("user:check_online", targetId, (isOnline: boolean) => {
      setPresenceMap((prev) => ({ ...prev, [targetId]: isOnline }));
      setConversations((prev) =>
        prev.map((c) =>
          String(c.participant.id).trim() === targetId
            ? { ...c, participant: { ...c.participant, isOnline } }
            : c
        )
      );
    });
  }, [selectedConversation?.participant?.id]);

  const isRealConversation = Boolean(
    selectedId && conversations.some((c) => c.id === selectedId)
  );

  useChatSocket({
    conversationId: isRealConversation ? selectedId : null,
    onNewMessage: handleSocketNewMessage,
    onConversationRead: handleSocketConversationRead,
    onUserStatus: handleSocketUserStatus,
  });

  useEffect(() => {
    if (!selectedId || !conversations.some((c) => c.id === selectedId)) return;

    getMessagesMutation.mutate(
      { conversationId: selectedId },
      {
        onSuccess: (res) => {
          if (res?.data) {
            const mapped = res.data.map((msg) =>
              toChatMessage(msg, currentUser?.id, "PROVIDER")
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
    const trimmed = text.trim();
    if (!selectedId || !trimmed) return;

    const isExisting = conversations.some((c) => c.id === selectedId);

    if (isExisting) {
      const tempId = `pmsg-${Date.now()}`;
      const optimisticMsg: ChatMessage = {
        id: tempId,
        conversationId: selectedId,
        senderId: currentUser?.id || "prov-current",
        senderRole: "PROVIDER",
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
                currentUser?.id,
                "PROVIDER"
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
                senderId: currentUser?.id || "prov-current",
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

          const tempId = `pmsg-${Date.now()}`;
          const optimisticMsg: ChatMessage = {
            id: tempId,
            conversationId: newConvId,
            senderId: currentUser?.id || "prov-current",
            senderRole: "PROVIDER",
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
                    currentUser?.id,
                    "PROVIDER"
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
                isInfoOpen={isInfoOpen}
                onToggleInfo={() => setIsInfoOpen((prev) => !prev)}
                onBackToMobileList={() => setIsMobileThreadOpen(false)}
              />

              <ChatRequestBanner
                request={selectedConversation.linkedRequest}
                currentRole="PROVIDER"
                onOpenDetails={() => setIsInfoOpen(true)}
              />

              <div className="chat-thread-body">
                {isMessagesLoading ? (
                  <ChatMessageListSkeleton />
                ) : (
                  <ChatMessageList
                    messages={activeMessages}
                    currentRole="PROVIDER"
                    currentUserId={currentUser?.id}
                  />
                )}
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
    </div>
  );
}
