import React from "react";
import type { ChatMessage } from "../types/chat.types";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  currentRole?: "CUSTOMER" | "PROVIDER";
  currentUserId?: string;
  onImageClick?: (imageUrl: string, caption?: string) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  currentRole = "CUSTOMER",
  currentUserId,
  onImageClick,
}) => {
  const isMe = currentUserId
    ? message.senderId === currentUserId
    : currentRole === "PROVIDER"
      ? message.senderRole === "PROVIDER"
      : message.senderRole === "CUSTOMER";

  const renderStatusTicks = () => {
    if (!isMe) return null;
    return (
      <span className="chat-msg-status-ticks">
        {message.status === "READ" ? (
          <i className="fas fa-check-double read" title="Seen" />
        ) : message.status === "DELIVERED" ? (
          <i className="fas fa-check-double" title="Delivered" />
        ) : (
          <i className="fas fa-check" title="Sent" />
        )}
      </span>
    );
  };

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
          <div
            className="chat-image-card"
            onClick={() => onImageClick?.(message.imageUrl!, message.text)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onImageClick?.(message.imageUrl!, message.text);
              }
            }}
            title="Click to view full photo"
          >
            <div className="chat-image-wrapper">
              <img
                src={message.imageUrl}
                alt={message.text || "Attached photo"}
                className="chat-attached-image"
              />
              {!message.text && (
                <div className="chat-image-overlay-meta">
                  <span className="chat-msg-time">{message.createdAt}</span>
                  {renderStatusTicks()}
                </div>
              )}
            </div>
            {message.text && (
              <div className="chat-image-caption-row">
                <span className="chat-image-caption-text">{message.text}</span>
                <span className="chat-bubble-meta">
                  <span className="chat-msg-time">{message.createdAt}</span>
                  {renderStatusTicks()}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="chat-text-bubble">
            <span className="chat-bubble-text">{message.text}</span>
            <span className="chat-bubble-meta">
              <span className="chat-msg-time">{message.createdAt}</span>
              {renderStatusTicks()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
