import React, { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat.types";
import { ChatMessageBubble } from "./ChatMessageBubble";

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentRole?: "CUSTOMER" | "PROVIDER";
  currentUserId?: string;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  currentRole = "CUSTOMER",
  currentUserId,
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
          Messages are encrypted. For verified ratings and protection, coordinate
          all service requirements within Briosolve.
        </span>
      </div>

      <div className="chat-date-separator">
        <span className="chat-date-pill">Today</span>
      </div>

      {messages.map((msg) => (
        <ChatMessageBubble
          key={msg.id}
          message={msg}
          currentRole={currentRole}
          currentUserId={currentUserId}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};
