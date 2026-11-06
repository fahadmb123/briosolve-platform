import React, { useEffect } from "react";

interface ChatImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  caption?: string;
  onClose: () => void;
}

export const ChatImageModal: React.FC<ChatImageModalProps> = ({
  isOpen,
  imageUrl,
  caption,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="chat-lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="chat-lightbox-header" onClick={(e) => e.stopPropagation()}>
        <span className="chat-lightbox-title">{caption || "Photo"}</span>
        <div className="chat-lightbox-actions">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-lightbox-action-btn"
            title="Open original in new tab"
            aria-label="Open original in new tab"
          >
            <i className="fas fa-external-link-alt" />
          </a>
          <button
            type="button"
            className="chat-lightbox-action-btn chat-lightbox-close-btn"
            onClick={onClose}
            title="Close viewer"
            aria-label="Close viewer"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </div>

      <div
        className="chat-lightbox-content"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={caption || "Full size photo"}
          className="chat-lightbox-image"
        />
        {caption && (
          <div className="chat-lightbox-caption-bar">
            <p className="chat-lightbox-caption-text">{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};

