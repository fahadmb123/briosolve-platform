import React from "react";
import type { ChatConversation } from "../types/chat.types";

interface ConversationItemProps {
  conversation: ChatConversation;
  isSelected: boolean;
  onSelect: (conversationId: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onSelect,
}) => {
  const { participant, linkedRequest, lastMessage, unreadCount } = conversation;

  return (
    <div
      className={`chat-conv-item ${isSelected ? "selected" : ""} ${unreadCount > 0 ? "unread" : ""}`}
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
            participant.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=05AD98&color=fff`
          }
          alt={participant.name}
          className="chat-avatar-img"
        />
        <span
          className={`chat-presence-dot ${participant.isOnline ? "online" : "offline"}`}
          title={participant.isOnline ? "Online now" : "Offline"}
        />
      </div>

      <div className="chat-conv-content">
        <div className="chat-conv-top">
          <div className="chat-conv-name-row">
            <h4 className="chat-conv-name">{participant.name}</h4>
            {participant.isVerified && (
              <span className="chat-verified-badge" title="Verified Specialist">
                <i className="fas fa-check-circle" />
              </span>
            )}
          </div>
          <span className="chat-conv-time">{lastMessage.createdAt}</span>
        </div>

        <div className="chat-conv-request-tag">
          <i className="fas fa-wrench chat-tag-icon" />
          <span className="chat-tag-text">{linkedRequest.title}</span>
        </div>

        <div className="chat-conv-bottom">
          <p className="chat-conv-preview">{lastMessage.text}</p>
          {unreadCount > 0 && (
            <span className="chat-unread-count-pill">{unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

