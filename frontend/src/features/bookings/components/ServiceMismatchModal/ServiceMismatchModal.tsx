import React, { useState } from "react";
import type { BookingItem } from "../../types/booking.types";
import { useGetCategoriesService } from "../../../service-catalog";
import "./ServiceMismatchModal.css";

interface ServiceMismatchModalProps {
  isOpen: boolean;
  booking: BookingItem | null;
  onClose: () => void;
  onSubmit: (payload: { diagnosis: string; suggestedCategory?: string | null; suggestedCategoryId?: string | null }) => void;
  isLoading?: boolean;
}

export const ServiceMismatchModal: React.FC<ServiceMismatchModalProps> = ({
  isOpen,
  booking,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const { data: categoriesRes } = useGetCategoriesService({ page: 1, limit: 100, filter: "ACTIVE" });
  const categories = categoriesRes?.data?.categories || [];

  if (!isOpen || !booking) return null;

  const isFixed = booking.quotationType === "FIXED";
  const advanceAmount = isFixed
    ? booking.totalAmount
    : (booking.quoteAmount
      ? Math.round(Number(booking.quoteAmount) * 1.1)
      : (booking.advanceAmount || booking.totalAmount));

  const visitFee = isFixed ? Math.min(advanceAmount, 250) : advanceAmount;
  const refundAmount = Math.max(0, advanceAmount - visitFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) return;

    const matchedCat = categories.find((c) => c.id === selectedCategoryId);
    onSubmit({
      diagnosis: diagnosis.trim(),
      suggestedCategoryId: selectedCategoryId || null,
      suggestedCategory: matchedCat ? matchedCat.name : null
    });
  };

  return (
    <div className="bkmismatch-overlay" onClick={onClose}>
      <div className="bkmismatch-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="bkmismatch-header">
          <div className="bkmismatch-icon-wrap">
            <i className="fas fa-stethoscope" />
          </div>
          <div className="bkmismatch-header-text">
            <h3>Different Problem Found On-Site?</h3>
            <p>
              If the on-site inspection reveals that a different trade or service is required, submit your diagnosis.
              The customer can accept to close this booking with your visit fee settled.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bkmismatch-body">
            <div className="bkmismatch-field">
              <label>
                Technician Diagnosis <span className="req">*</span>
              </label>
              <textarea
                className="bkmismatch-textarea"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Describe the actual issue found on site and why the original service cannot proceed..."
                required
                disabled={isLoading}
              />
            </div>

            <div className="bkmismatch-field">
              <label>Recommended Category / Service (Optional)</label>
              <select
                className="bkmismatch-select"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select recommended category (if different)</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bkmismatch-settle-card">
              <div className="bkmismatch-settle-title">
                <i className="fas fa-hand-holding-usd" />
                <span>Visit Fee &amp; Settlement Terms</span>
              </div>
              <div className="bkmismatch-settle-row">
                <span>Visit &amp; Diagnosis Fee Credited to You:</span>
                <strong className="fee">₹{visitFee.toLocaleString("en-IN")}</strong>
              </div>
              <div className="bkmismatch-settle-row">
                <span>Remaining Deposit Refunded to Customer:</span>
                <strong className="refund">₹{refundAmount.toLocaleString("en-IN")}</strong>
              </div>
              <div className="bkmismatch-settle-note">
                When the customer accepts this diagnosis report, your visit fee is immediately released to your wallet, and this booking is closed safely.
              </div>
            </div>
          </div>

          <div className="bkmismatch-footer">
            <button
              type="button"
              className="bkmismatch-btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bkmismatch-btn-submit"
              disabled={isLoading || !diagnosis.trim()}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane" />
                  <span>Submit Diagnosis Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
