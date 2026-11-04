import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  MOCK_PROVIDER_CONVERSATIONS,
  MOCK_PROVIDER_MESSAGES_MAP,
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
  CreateQuoteModal,
} from "../../components";
import "../CustomerChat/CustomerChat.css";

const PROVIDER_PROMPTS = [
  "I can visit your location within 45 minutes.",
  "Could you please confirm your flat or house number?",
  "I have submitted our official quotation above.",
  "Replacement parts and 30-day warranty are included.",
];

export default function ProviderChat() {
  const [conversations, setConversations] = useState<ChatConversation[]>(
    MOCK_PROVIDER_CONVERSATIONS
  );
  const [selectedId, setSelectedId] = useState<string | null>("pconv-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<ConversationFilter>("ALL");
  const [messagesMap, setMessagesMap] = useState<
    Record<string, ChatMessage[]>
  >(MOCK_PROVIDER_MESSAGES_MAP);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedId) || null;
  }, [conversations, selectedId]);

  const activeMessages = useMemo(() => {
    if (!selectedId) return [];
    return messagesMap[selectedId] || [];
  }, [messagesMap, selectedId]);

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
    if (!selectedId) return;

    const newMsg: ChatMessage = {
      id: `pmsg-${Date.now()}`,
      conversationId: selectedId,
      senderId: "prov-current",
      senderRole: "PROVIDER",
      senderName: "You",
      text,
      type: "TEXT",
      status: "SENT",
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              lastMessage: {
                text,
                senderId: "prov-current",
                createdAt: newMsg.createdAt,
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
    if (!selectedId || !selectedConversation) return;

    const newQuoteMsg: ChatMessage = {
      id: `pmsg-quote-${Date.now()}`,
      conversationId: selectedId,
      senderId: "prov-current",
      senderRole: "PROVIDER",
      senderName: "You",
      text: "Official Service Quotation",
      type: "QUOTE",
      quotePayload: {
        quoteId: `quote-${Date.now()}`,
        requestId: selectedConversation.linkedRequest.id,
        requestTitle: selectedConversation.linkedRequest.title,
        amount: payload.amount,
        durationHours: payload.durationHours,
        includesParts: payload.includesParts,
        notes: payload.notes,
        status: "PENDING",
      },
      status: "SENT",
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessagesMap((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newQuoteMsg],
    }));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              hasActiveQuote: true,
              lastMessage: {
                text: `Official Quotation submitted for ₹${payload.amount.toLocaleString()}`,
                senderId: "prov-current",
                createdAt: newQuoteMsg.createdAt,
                isUnread: false,
              },
              updatedAt: new Date().toISOString(),
            }
          : c
      )
    );

    toast.success("Quotation submitted to client!");
  };

  return (
    <div className="chat-layout-root provider-chat-mode">
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
                currentRole="PROVIDER"
                isInfoOpen={isInfoOpen}
                onToggleInfo={() => setIsInfoOpen((prev) => !prev)}
                onBackToMobileList={() => setIsMobileThreadOpen(false)}
                onOpenCreateQuote={() => setIsQuoteModalOpen(true)}
              />

              <ChatRequestBanner
                request={selectedConversation.linkedRequest}
                currentRole="PROVIDER"
                onOpenDetails={() => setIsInfoOpen(true)}
              />

              <div className="chat-thread-body">
                <ChatMessageList
                  messages={activeMessages}
                  currentRole="PROVIDER"
                />
              </div>

              <ChatInputBar
                onSendMessage={handleSendMessage}
                prompts={PROVIDER_PROMPTS}
              />
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
              currentRole="PROVIDER"
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

