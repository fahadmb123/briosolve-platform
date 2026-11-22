import React, { useState } from "react";
import type { TicketCategory } from "../../types/support.types";
import "./RaiseDisputeModal.css";

interface RaiseDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: {
    id: string;
    bookingNumber: string;
    serviceRequestTitle?: string;
    totalAmount?: number;
    advanceAmount?: number;
    providerName?: string;
    customerName?: string;
  };
  role: "CUSTOMER" | "PROVIDER";
  onSubmitConcern: (data: {
    bookingId: string;
    category: TicketCategory;
    subject: string;
    description: string;
  }) => void;
}

const CUSTOMER_CATEGORIES: { value: TicketCategory; label: string; desc: string }[] = [
  { value: "PROVIDER_NO_SHOW", label: "Technician Did Not Arrive", desc: "Technician missed the scheduled arrival time or is unresponsive" },
  { value: "POOR_WORKMANSHIP", label: "Incomplete / Poor Work", desc: "Work was left incomplete, improperly repaired, or damaged property" },
  { value: "UNAUTHORIZED_CHARGES", label: "Demanding Extra Cash", desc: "Technician asked for extra cash offline outside the platform" },
  { value: "SAFETY_CONDUCT", label: "Unprofessional / Safety Concern", desc: "Hostile behavior, safety breach, or conduct concern" },
  { value: "PAYMENT_REFUND", label: "Escrow / Refund Dispute", desc: "Disagreement over escrow release or cancellation refund" },
  { value: "GENERAL_INQUIRY", label: "Other Concern", desc: "Other issue requiring platform assistance" }
];

const PROVIDER_CATEGORIES: { value: TicketCategory; label: string; desc: string }[] = [
  { value: "CUSTOMER_ABSENT", label: "Customer Absent at Location", desc: "Reached the address but customer is not present and cannot be reached" },
  { value: "PAYMENT_DISPUTE", label: "Customer Refusing Payment", desc: "Work completed but customer refuses to approve or settle balance" },
  { value: "SCOPE_DISPUTE", label: "Unpaid Extra Work Demands", desc: "Customer insists on additional tasks beyond the quotation" },
  { value: "SAFETY_PREMISES", label: "Unsafe Work Premises", desc: "Location is hazardous, hostile, or physically inaccessible" },
  { value: "GENERAL_INQUIRY", label: "Other Concern", desc: "Other operational dispute requiring admin intervention" }
];

export const RaiseDisputeModal: React.FC<RaiseDisputeModalProps> = ({
  isOpen,
  onClose,
  booking,
  role,
  onSubmitConcern,
}) => {
  const isCustomer = role === "CUSTOMER";
  const categories = isCustomer ? CUSTOMER_CATEGORIES : PROVIDER_CATEGORIES;

  const [category, setCategory] = useState<TicketCategory>(
    isCustomer ? "PROVIDER_NO_SHOW" : "CUSTOMER_ABSENT"
  );
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    onSubmitConcern({
      bookingId: booking.id,
      category,
      subject: subject.trim(),
      description: description.trim(),
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="rdm-overlay" onClick={onClose}>
      <div className="rdm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="rdm-header">
          <div className="rdm-icon-box">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div>
            <h3 className="rdm-title">Report an Issue / Dispute</h3>
            <span className="rdm-booking-ref">Booking #{booking.bookingNumber}</span>
          </div>
          <button type="button" className="rdm-close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rdm-body">
          <div className="rdm-escrow-notice">
            <i className="fas fa-shield-alt"></i>
            <div>
              <strong>Escrow Protection Active</strong>
              <span>
                Raising a concern flags this booking for immediate admin review. Escrow funds will remain safely locked until resolved.
              </span>
            </div>
          </div>

          <div className="rdm-field">
            <label htmlFor="rdm-cat">What went wrong? *</label>
            <select
              id="rdm-cat"
              className="rdm-select"
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <span className="rdm-cat-hint">
              {categories.find((c) => c.value === category)?.desc}
            </span>
          </div>

          <div className="rdm-field">
            <label htmlFor="rdm-sub">Subject *</label>
            <input
              id="rdm-sub"
              type="text"
              required
              className="rdm-input"
              placeholder={isCustomer ? "e.g. Technician never arrived at scheduled time" : "e.g. Customer not answering phone at premises"}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="rdm-field">
            <label htmlFor="rdm-desc">Detailed Description *</label>
            <textarea
              id="rdm-desc"
              required
              rows={4}
              className="rdm-textarea"
              placeholder="Provide exact details of what happened, time, calls made, or issues encountered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="rdm-footer">
            <button type="button" className="rdm-btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="rdm-btn-submit"
              disabled={isSubmitting || !subject.trim() || !description.trim()}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Filing Ticket...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-flag"></i>
                  <span>Submit Concern</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
