import React from "react";
import type { ChatMessage } from "../types/chat.types";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  currentRole?: "CUSTOMER" | "PROVIDER";
  currentUserId?: string;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  currentRole = "CUSTOMER",
  currentUserId,
}) => {
  const isMe = currentUserId
    ? message.senderId === currentUserId
    : currentRole === "PROVIDER"
      ? message.senderRole === "PROVIDER"
      : message.senderRole === "CUSTOMER";

  return (
    <div className={`chat-message-row ${isMe ? "outgoing" : "incoming"}`}>
      {!isMe && message.senderAvatar && (
        <img
          src={message.senderAvatar}
          alt={message.senderName}
          className="chat-msg-avatar"
        />
      )}

      <div className="chat-bubble-container">
        {message.type === "IMAGE" && message.imageUrl ? (
          <div className="chat-image-card">
            <img
              src={message.imageUrl}
              alt={message.text || "Attached photo"}
              className="chat-attached-image"
            />
            {message.text && (
              <p className="chat-image-caption">{message.text}</p>
            )}
          </div>
        ) : (
          <div className="chat-text-bubble">
            <p className="chat-bubble-text">{message.text}</p>
          </div>
        )}

        <div className="chat-bubble-footer">
          <span className="chat-msg-time">{message.createdAt}</span>
          {isMe && (
            <span className="chat-msg-status-ticks">
              {message.status === "READ" ? (
                <i
                  className="fas fa-check-double read"
                  title="Seen"
                />
              ) : message.status === "DELIVERED" ? (
                <i className="fas fa-check-double" title="Delivered" />
              ) : (
                <i className="fas fa-check" title="Sent" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
