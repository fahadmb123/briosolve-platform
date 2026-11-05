import React from "react";
import type { ChatConversation, ConversationFilter } from "../types/chat.types";
import { ConversationItem } from "./ConversationItem";
import { ConversationListSkeleton } from "./ChatSkeleton";

interface ConversationListProps {
  conversations: ChatConversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filter: ConversationFilter;
  onFilterChange: (f: ConversationFilter) => void;
  isLoading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  isLoading = false,
}) => {
  const unreadTotal = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="chat-sidebar-panel">
      <div className="chat-sidebar-header">
        <div className="chat-sidebar-title-row">
          <div className="chat-sidebar-heading-group">
            <h2 className="chat-sidebar-title">Messages</h2>
            {unreadTotal > 0 && (
              <span className="chat-badge-total-unread">{unreadTotal} unread</span>
            )}
          </div>
        </div>

        <div className="chat-search-input-box">
          <i className="fas fa-search chat-search-icon" />
          <input
            type="text"
            className="chat-search-input"
            placeholder="Search provider or service..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="chat-search-clear-btn"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        <div className="chat-filter-tabs">
          <button
            type="button"
            className={`chat-filter-btn ${filter === "ALL" ? "active" : ""}`}
            onClick={() => onFilterChange("ALL")}
          >
            All
          </button>
          <button
            type="button"
            className={`chat-filter-btn ${filter === "UNREAD" ? "active" : ""}`}
            onClick={() => onFilterChange("UNREAD")}
          >
            Unread
          </button>
        </div>
      </div>

      <div className="chat-conversations-scroll">
        {isLoading ? (
          <ConversationListSkeleton count={5} />
        ) : conversations.length === 0 ? (
          <div className="chat-empty-conversations">
            <i className="far fa-comment-dots chat-empty-icon" />
            <p className="chat-empty-title">No conversations found</p>
            <p className="chat-empty-subtitle">
              {searchQuery
                ? "Try searching with different keywords"
                : "Active chats with providers will appear here"}
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

