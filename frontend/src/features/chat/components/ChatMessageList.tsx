import React, { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat.types";
import { ChatMessageBubble } from "./ChatMessageBubble";

interface ChatMessageListProps {
  messages: ChatMessage[];
  onAcceptQuote?: (quoteId: string) => void;
  onDeclineQuote?: (quoteId: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  onAcceptQuote,
  onDeclineQuote,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-messages-container">
      <div className="chat-security-tip-bubble">
        <i className="fas fa-lock" />
        <span>
          Messages are encrypted. For your protection and warranty, keep all
          discussions and payments inside Briosolve.
        </span>
      </div>

      <div className="chat-date-separator">
        <span className="chat-date-pill">Today</span>
      </div>

      {messages.map((msg) => (
        <ChatMessageBubble
          key={msg.id}
          message={msg}
          onAcceptQuote={onAcceptQuote}
          onDeclineQuote={onDeclineQuote}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

