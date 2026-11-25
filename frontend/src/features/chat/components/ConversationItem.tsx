import React from "react";
import type { ChatConversation } from "../types/chat.types";

interface ConversationItemProps {
  conversation: ChatConversation;
  isSelected: boolean;
  onSelect: (conversationId: string) => void;
  currentUserId?: string;
  isTyping?: boolean;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect,
  currentUserId,
  isTyping = false,
}) => {
  const { participant, lastMessage, unreadCount } = conversation;
  const participantName = participant?.name || "User";
  const isOwnLastMessage = Boolean(
    currentUserId &&
      lastMessage?.senderId &&
      String(lastMessage.senderId).trim() === String(currentUserId).trim()
  );

  const renderLastMessageTick = () => {
    if (!isOwnLastMessage || (!lastMessage?.text && lastMessage?.messageType !== "IMAGE")) {
      return null;
    }
    const status = lastMessage?.status || "SENT";
    if (status === "SENDING") {
      return <i className="far fa-clock chat-conv-tick sending" title="Sending" />;
    }
    if (status === "READ") {
      return <i className="fas fa-check-double chat-conv-tick read" title="Seen" />;
    }
    if (status === "DELIVERED") {
      return <i className="fas fa-check-double chat-conv-tick" title="Delivered" />;
    }
    return <i className="fas fa-check chat-conv-tick" title="Sent" />;
  };

  return (
    <div
      className={`chat-conv-item ${isSelected ? "selected" : ""} ${(unreadCount || 0) > 0 ? "unread" : ""}`}
      onClick={() => onSelect(conversation.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(conversation.id);
        }
      }}
    >
      <div className="chat-avatar-wrapper">
        <img
          src={
            participant?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(participantName)}&background=FF7900&color=fff`
          }
          alt={participantName}
          className="chat-avatar-img"
        />
        <span
          className={`chat-presence-dot ${participant?.isOnline ? "online" : "offline"}`}
          title={participant?.isOnline ? "Online now" : "Offline"}
        />
      </div>

      <div className="chat-conv-content">
        <div className="chat-conv-top">
          <div className="chat-conv-name-row">
            <h4 className="chat-conv-name">{participantName}</h4>
            {participant?.isVerified && (
              <span className="chat-verified-badge" title="Verified Specialist">
                <i className="fas fa-check-circle" />
              </span>
            )}
          </div>
          <span className="chat-conv-time">{lastMessage?.createdAt || ""}</span>
        </div>

        <div className="chat-conv-bottom">
          {isTyping ? (
            <p className="chat-conv-preview typing">typing...</p>
          ) : (
            <p className="chat-conv-preview">
              {renderLastMessageTick()}
              {lastMessage?.messageType === "IMAGE" && (
                <i className="fas fa-camera chat-conv-photo-icon" />
              )}
              <span>{lastMessage?.text || ""}</span>
            </p>
          )}
          {(unreadCount || 0) > 0 && (
            <span className="chat-unread-count-pill">{unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

