import React, { useState, useRef, useEffect } from "react";
import EmojiPicker, { Theme, type EmojiClickData } from "emoji-picker-react";
import { useTheme } from "../../../shared/hooks/useTheme";

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
  const { theme } = useTheme();
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showEmojiPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (emojiContainerRef.current && !emojiContainerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    const handleKeyDownClose = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDownClose);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDownClose);
    };
  }, [showEmojiPicker]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const textarea = textareaRef.current;
    if (!textarea) {
      setInputText((prev) => prev + emoji);
      return;
    }

    const start = textarea.selectionStart ?? inputText.length;
    const end = textarea.selectionEnd ?? inputText.length;
    const updated = inputText.slice(0, start) + emoji + inputText.slice(end);
    setInputText(updated);

    requestAnimationFrame(() => {
      textarea.focus();
      const caret = start + emoji.length;
      textarea.setSelectionRange(caret, caret);
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    });
  };

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

    setShowEmojiPicker(false);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
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

      <div className="chat-input-row" ref={emojiContainerRef}>
        {showEmojiPicker && !disabled && (
          <div className="chat-emoji-popover">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
              width="100%"
              height={360}
              searchPlaceholder="Search emojis..."
              previewConfig={{ showPreview: false }}
              lazyLoadEmojis
            />
          </div>
        )}

        <button
          type="button"
          className={`chat-emoji-btn ${showEmojiPicker ? "active" : ""}`}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          disabled={disabled}
          title="Add emoji"
          aria-label="Add emoji"
          aria-expanded={showEmojiPicker}
        >
          <i className="far fa-smile" />
        </button>

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
          ref={textareaRef}
          rows={1}
          placeholder="Type a message... (Press Enter to send)"
          className="chat-textarea"
          value={inputText}
          onChange={handleTextareaChange}
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
