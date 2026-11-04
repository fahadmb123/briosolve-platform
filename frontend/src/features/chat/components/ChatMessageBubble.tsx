import React from "react";
import type { ChatMessage } from "../types/chat.types";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onAcceptQuote?: (quoteId: string) => void;
  onDeclineQuote?: (quoteId: string) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  onAcceptQuote,
  onDeclineQuote,
}) => {
  const isMe = message.senderRole === "CUSTOMER";

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
        {message.type === "QUOTE" && message.quotePayload ? (
          <div className="chat-quote-card">
            <div className="chat-quote-header">
              <div className="chat-quote-badge">
                <i className="fas fa-file-invoice-dollar" />
                <span>Service Quotation</span>
              </div>
              <span className="chat-quote-amount">
                ₹{message.quotePayload.amount.toLocaleString()}
              </span>
            </div>

            <div className="chat-quote-body">
              <h5 className="chat-quote-title">
                {message.quotePayload.requestTitle}
              </h5>
              {message.quotePayload.notes && (
                <p className="chat-quote-notes">{message.quotePayload.notes}</p>
              )}

              <div className="chat-quote-specs">
                {message.quotePayload.durationHours && (
                  <span className="chat-quote-spec-chip">
                    <i className="far fa-hourglass" /> Est.{" "}
                    {message.quotePayload.durationHours} hr
                  </span>
                )}
                <span className="chat-quote-spec-chip">
                  <i className="fas fa-tools" />{" "}
                  {message.quotePayload.includesParts
                    ? "Parts Included"
                    : "Labour Only"}
                </span>
                <span className="chat-quote-spec-chip">
                  <i className="fas fa-shield-alt" /> 30-Day Guarantee
                </span>
              </div>
            </div>

            <div className="chat-quote-actions">
              {message.quotePayload.status === "PENDING" ? (
                <>
                  <button
                    type="button"
                    className="chat-quote-btn-accept"
                    onClick={() =>
                      onAcceptQuote?.(message.quotePayload!.quoteId)
                    }
                  >
                    <i className="fas fa-check" />
                    <span>Accept Quote</span>
                  </button>
                  <button
                    type="button"
                    className="chat-quote-btn-decline"
                    onClick={() =>
                      onDeclineQuote?.(message.quotePayload!.quoteId)
                    }
                  >
                    <span>Decline</span>
                  </button>
                </>
              ) : (
                <div
                  className={`chat-quote-status-tag ${message.quotePayload.status.toLowerCase()}`}
                >
                  <i
                    className={`fas ${
                      message.quotePayload.status === "ACCEPTED"
                        ? "fa-check-circle"
                        : "fa-times-circle"
                    }`}
                  />
                  <span>Quote {message.quotePayload.status}</span>
                </div>
              )}
            </div>
          </div>
        ) : message.type === "IMAGE" && message.imageUrl ? (
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
                  title="Seen by provider"
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

