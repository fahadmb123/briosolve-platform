import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ConversationItemSkeleton: React.FC = () => {
  return (
    <div className="chat-conv-item" style={{ pointerEvents: "none" }} aria-hidden="true">
      <div className="chat-avatar-wrapper">
        <Skeleton circle width={44} height={44} />
      </div>
      <div className="chat-conv-content" style={{ flex: 1, minWidth: 0 }}>
        <div className="chat-conv-top">
          <Skeleton width={120} height={15} borderRadius={4} />
          <Skeleton width={38} height={12} borderRadius={4} />
        </div>
        <div style={{ marginTop: 6 }}>
          <Skeleton width={140} height={14} borderRadius={4} />
        </div>
        <div style={{ marginTop: 6 }}>
          <Skeleton width="85%" height={12} borderRadius={4} />
        </div>
      </div>
    </div>
  );
};

export const ConversationListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="chat-conversations-skeleton" aria-hidden="true">
      {Array.from({ length: count }).map((_, idx) => (
        <ConversationItemSkeleton key={idx} />
      ))}
    </div>
  );
};

interface ChatMessageBubbleSkeletonProps {
  isMe?: boolean;
  width?: number | string;
  height?: number;
}

export const ChatMessageBubbleSkeleton: React.FC<ChatMessageBubbleSkeletonProps> = ({
  isMe = false,
  width = 240,
  height = 44,
}) => {
  return (
    <div
      className={`chat-message-row ${isMe ? "outgoing" : "incoming"}`}
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    >
      {!isMe && (
        <div style={{ flexShrink: 0, marginBottom: 4 }}>
          <Skeleton circle width={32} height={32} />
        </div>
      )}

      <div className="chat-bubble-container">
        <div style={{ width: "fit-content", maxWidth: "100%" }}>
          <Skeleton
            width={width}
            height={height}
            style={{
              borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            }}
          />
        </div>
        <div className="chat-bubble-footer">
          <Skeleton width={36} height={10} borderRadius={3} />
        </div>
      </div>
    </div>
  );
};

export const ChatMessageListSkeleton: React.FC = () => {
  return (
    <div className="chat-messages-container" aria-hidden="true">
      <div className="chat-date-separator">
        <Skeleton width={70} height={20} borderRadius={9999} />
      </div>

      <ChatMessageBubbleSkeleton isMe={false} width={220} height={42} />
      <ChatMessageBubbleSkeleton isMe={false} width={300} height={56} />
      <ChatMessageBubbleSkeleton isMe={true} width={180} height={40} />
      <ChatMessageBubbleSkeleton isMe={false} width={260} height={46} />
      <ChatMessageBubbleSkeleton isMe={true} width={240} height={50} />
      <ChatMessageBubbleSkeleton isMe={true} width={130} height={38} />
    </div>
  );
};

export const ChatHeaderSkeleton: React.FC = () => {
  return (
    <header className="chat-main-header" style={{ pointerEvents: "none" }} aria-hidden="true">
      <div className="chat-header-left" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Skeleton circle width={42} height={42} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Skeleton width={140} height={18} borderRadius={4} />
          <Skeleton width={90} height={12} borderRadius={4} />
        </div>
      </div>
      <div className="chat-header-actions" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Skeleton width={90} height={34} borderRadius={8} />
      </div>
    </header>
  );
};

export const ChatRequestBannerSkeleton: React.FC = () => {
  return (
    <div className="chat-request-banner" style={{ pointerEvents: "none" }} aria-hidden="true">
      <div className="chat-banner-left" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Skeleton width={36} height={36} borderRadius={8} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Skeleton width={200} height={16} borderRadius={4} />
          <Skeleton width={240} height={12} borderRadius={4} />
        </div>
      </div>
      <div className="chat-banner-right" style={{ display: "flex", gap: "0.5rem" }}>
        <Skeleton width={100} height={30} borderRadius={6} />
      </div>
    </div>
  );
};

export const ChatThreadSkeleton: React.FC = () => {
  return (
    <div className="chat-thread-view" style={{ pointerEvents: "none" }} aria-hidden="true">
      <ChatHeaderSkeleton />
      <ChatRequestBannerSkeleton />
      <div className="chat-thread-body">
        <ChatMessageListSkeleton />
      </div>
      <div className="chat-input-wrapper">
        <div className="chat-input-row" style={{ opacity: 0.7 }}>
          <Skeleton width="90%" height={20} borderRadius={4} />
          <Skeleton circle width={38} height={38} />
        </div>
      </div>
    </div>
  );
};

