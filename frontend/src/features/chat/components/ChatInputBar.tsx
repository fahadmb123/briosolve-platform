import React, { useState, useRef } from "react";

interface ChatInputBarProps {
  onSendMessage: (text: string, imageFile?: File) => void;
  prompts?: string[];
  disabled?: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  onSendMessage,
  prompts = [],
  disabled = false,
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if ((!trimmed && !selectedFile) || disabled) return;

    const fileToSend = selectedFile || undefined;
    onSendMessage(trimmed, fileToSend);

    setInputText("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = Boolean(inputText.trim() || selectedFile) && !disabled;

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

      {previewUrl && selectedFile && (
        <div className="chat-attachment-preview-bar">
          <div className="chat-attachment-thumb-box">
            <img
              src={previewUrl}
              alt={selectedFile.name}
              className="chat-attachment-thumb"
            />
          </div>
          <div className="chat-attachment-info">
            <span className="chat-attachment-filename">{selectedFile.name}</span>
            <span className="chat-attachment-size">
              {(selectedFile.size / 1024).toFixed(0)} KB
            </span>
          </div>
          <button
            type="button"
            className="chat-attachment-remove-btn"
            onClick={handleRemoveFile}
            title="Remove image"
            aria-label="Remove image"
          >
            <i className="fas fa-times" />
          </button>
        </div>
      )}

      <div className="chat-input-row">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={disabled}
        />
        <button
          type="button"
          className="chat-attach-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Attach image"
          aria-label="Attach image"
        >
          <i className="fas fa-paperclip" />
        </button>

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
            className={`chat-send-btn ${canSend ? "active" : ""}`}
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
          >
            <i className="fas fa-paper-plane" />
          </button>
        </div>
      </div>
    </div>
  );
};