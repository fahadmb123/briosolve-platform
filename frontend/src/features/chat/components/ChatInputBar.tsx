import React, { useState } from "react";

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

const QUICK_PROMPTS = [
  "Are you available today?",
  "Could you share arrival time estimate?",
  "Does the quote include replacement parts?",
  "My address is confirmed.",
];

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
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
      <div className="chat-quick-prompts-row">
        {QUICK_PROMPTS.map((prompt, idx) => (
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

      <div className="chat-input-row">
        <button
          type="button"
          className="chat-attach-btn"
          title="Attach photo or document"
        >
          <i className="fas fa-paperclip" />
        </button>

        <textarea
          rows={1}
          className="chat-textarea"
          placeholder="Type a message... (Press Enter to send)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

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
  );
};

