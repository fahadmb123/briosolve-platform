import React, { useState } from "react";
import type { ChatLinkedRequest, ChatParticipant } from "../types/chat.types";

interface CreateQuoteModalProps {
  isOpen: boolean;
  participant: ChatParticipant;
  linkedRequest: ChatLinkedRequest;
  onClose: () => void;
  onSubmitQuote: (payload: {
    amount: number;
    durationHours: number;
    includesParts: boolean;
    notes: string;
  }) => void;
}

export const CreateQuoteModal: React.FC<CreateQuoteModalProps> = ({
  isOpen,
  participant,
  linkedRequest,
  onClose,
  onSubmitQuote,
}) => {
  const [amount, setAmount] = useState<string>(
    linkedRequest.budgetAmount ? String(linkedRequest.budgetAmount) : ""
  );
  const [durationHours, setDurationHours] = useState<number>(1);
  const [includesParts, setIncludesParts] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid quotation amount in ₹");
      return;
    }

    onSubmitQuote({
      amount: parsedAmount,
      durationHours: Number(durationHours) || 1,
      includesParts,
      notes: notes.trim() || "Service quotation includes labor and professional tools.",
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="chat-quote-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="chat-quote-modal-header">
          <div className="chat-quote-modal-icon">
            <i className="fas fa-file-invoice-dollar" />
          </div>
          <div>
            <h3 className="chat-quote-modal-title">Send Official Quotation</h3>
            <p className="chat-quote-modal-sub">
              To {participant.name} for {linkedRequest.title}
            </p>
          </div>
          <button
            type="button"
            className="chat-quote-modal-close"
            onClick={onClose}
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="chat-quote-modal-form">
          <div className="chat-modal-form-group">
            <label className="chat-modal-label">
              Quotation Amount (₹) <span className="text-danger">*</span>
            </label>
            <div className="chat-modal-input-wrap">
              <span className="chat-currency-symbol">₹</span>
              <input
                type="number"
                min="1"
                step="50"
                className="chat-modal-input"
                placeholder="e.g. 1200"
                value={amount}
                onChange={(e) => {
                  setError("");
                  setAmount(e.target.value);
                }}
                required
                autoFocus
              />
            </div>
            {error && <span className="chat-modal-error">{error}</span>}
          </div>

          <div className="chat-modal-form-row">
            <div className="chat-modal-form-group flex-1">
              <label className="chat-modal-label">Estimated Hours</label>
              <input
                type="number"
                min="0.5"
                max="48"
                step="0.5"
                className="chat-modal-input"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
              />
            </div>

            <div className="chat-modal-form-group flex-1">
              <label className="chat-modal-label">Materials & Parts</label>
              <label className="chat-modal-checkbox-row">
                <input
                  type="checkbox"
                  checked={includesParts}
                  onChange={(e) => setIncludesParts(e.target.checked)}
                />
                <span>Parts Included</span>
              </label>
            </div>
          </div>

          <div className="chat-modal-form-group">
            <label className="chat-modal-label">Work Scope / Notes</label>
            <textarea
              rows={3}
              className="chat-modal-textarea"
              placeholder="Detail what is covered, warranty period, or special conditions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="chat-quote-modal-actions">
            <button
              type="button"
              className="chat-modal-btn cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="chat-modal-btn submit">
              <i className="fas fa-paper-plane" />
              <span>Send Quotation to Client</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

