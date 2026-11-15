import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat.types";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { ChatImageModal } from "./ChatImageModal";

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentRole?: "CUSTOMER" | "PROVIDER";
  currentUserId?: string;
  conversationId?: string;
}

function getMessageDateLabel(msg: ChatMessage): string {
  const dateStr = msg.rawCreatedAt || msg.createdAt;
  if (!dateStr) return "Today";

  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) {
    return "Today";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const msgDay = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());

  if (msgDay.getTime() === today.getTime()) {
    return "Today";
  }

  if (msgDay.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  if (parsed.getFullYear() === now.getFullYear()) {
    return parsed.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentRole = "CUSTOMER",
  currentUserId,
  conversationId,
}) => {
  const [previewImage, setPreviewImage] = useState<{ url: string; caption?: string } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialOpenRef = useRef<boolean>(true);
  const prevConversationIdRef = useRef<string | undefined>(conversationId);

  useEffect(() => {
    if (conversationId && conversationId !== prevConversationIdRef.current) {
      prevConversationIdRef.current = conversationId;
      isInitialOpenRef.current = true;
    }
  }, [conversationId]);

  useLayoutEffect(() => {
    if (!bottomRef.current) return;

    const scrollToBottomDirect = () => {
      const container = bottomRef.current?.closest(".chat-thread-body") as HTMLElement | null;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };

    if (isInitialOpenRef.current) {
      scrollToBottomDirect();
      if (messages.length > 0) {
        isInitialOpenRef.current = false;
      }
      const rafId = requestAnimationFrame(scrollToBottomDirect);
      const timerId = setTimeout(scrollToBottomDirect, 50);
      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timerId);
      };
    } else {
      const container = bottomRef.current?.closest(".chat-thread-body") as HTMLElement | null;
      if (container) {
        container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      }
    }
  }, [messages]);

  return (
    <div className="chat-messages-container">
      <div className="chat-security-tip-bubble">
        <i className="fas fa-lock" />
        <span>
          Messages are encrypted. For verified ratings and protection, coordinate
          all service requirements within Briosolve.
        </span>
      </div>

      {messages.map((msg, index) => {
        const currentLabel = getMessageDateLabel(msg);
        const prevMsg = messages[index - 1];
        const prevLabel = prevMsg ? getMessageDateLabel(prevMsg) : null;
        const showSeparator = index === 0 || currentLabel !== prevLabel;

        return (
          <React.Fragment key={msg.id}>
            {showSeparator && (
              <div className="chat-date-separator">
                <span className="chat-date-pill">{currentLabel}</span>
              </div>
            )}
            <ChatMessageBubble
              message={msg}
              currentRole={currentRole}
              currentUserId={currentUserId}
              onImageClick={(url, caption) => setPreviewImage({ url, caption })}
            />
          </React.Fragment>
        );
      })}

      <div ref={bottomRef} />

      <ChatImageModal
        isOpen={Boolean(previewImage)}
        imageUrl={previewImage?.url || ""}
        caption={previewImage?.caption}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
};
