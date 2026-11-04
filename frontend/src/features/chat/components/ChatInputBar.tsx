import React, { useState } from "react";

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  prompts?: string[];
  disabled?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  prompts = [],
  disabled = false,
}) => {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || disabled) return;
    onSendMessage(trimmed);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-wrapper">
      {prompts.length > 0 && (
        <div className="chat-quick-prompts-row">
          {prompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              className="chat-prompt-pill"
              onClick={() => onSendMessage(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-row">
        <textarea
          rows={1}
          placeholder="Type a message... (Press Enter to send)"
          className="chat-textarea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <div className="chat-input-actions">
          <button
            type="button"
            className={`chat-send-btn ${inputText.trim() ? "active" : ""}`}
            onClick={handleSend}
            disabled={!inputText.trim() || disabled}
            aria-label="Send message"
          >
            <i className="fas fa-paper-plane" />
          </button>
        </div>
      </div>
    </div>
  );
};
