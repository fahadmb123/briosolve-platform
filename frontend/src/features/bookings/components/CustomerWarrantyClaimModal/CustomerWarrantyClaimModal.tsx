import React, { useState, useEffect } from "react";
import type { BookingItem } from "../../types/booking.types";
import "./CustomerWarrantyClaimModal.css";

interface CustomerWarrantyClaimModalProps {
  isOpen: boolean;
  booking: BookingItem | null;
  onClose: () => void;
  onSubmit: (payload: {
    issueDescription: string;
    proofImages?: string[];
    preferredDate?: string;
    preferredTime?: string;
  }) => void;
  isLoading?: boolean;
}

const TIME_SLOTS = [
  "Morning (09:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 04:00 PM)",
  "Evening (04:00 PM - 07:00 PM)"
];

export const CustomerWarrantyClaimModal: React.FC<CustomerWarrantyClaimModalProps> = ({
  isOpen,
  booking,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [issueDescription, setIssueDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const warranty = booking?.warranty;
  const daysRemaining = warranty?.expiresAt
    ? Math.max(0, Math.ceil((new Date(warranty.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : (warranty?.days || 0);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen) {
      setIssueDescription("");
      setPreferredDate("");
      setPreferredTime("");
      setImageUrlInput("");
      setProofImages([]);
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const handleAddImage = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (proofImages.length >= 3) {
      setErrorMsg("Maximum 3 reference images allowed");
      return;
    }
    setProofImages((prev) => [...prev, trimmed]);
    setImageUrlInput("");
    setErrorMsg("");
  };

  const handleRemoveImage = (index: number) => {
    setProofImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) {
      setErrorMsg("Please describe the issue encountered with the service");
      return;
    }
    onSubmit({
      issueDescription: issueDescription.trim(),
      proofImages: proofImages.length > 0 ? proofImages : undefined,
      preferredDate: preferredDate || undefined,
      preferredTime: preferredTime || undefined
    });
  };

  return (
    <div className="bkclaim-overlay" onClick={onClose}>
      <div className="bkclaim-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="bkclaim-header">
          <div className="bkclaim-header-icon">
            <i className="fas fa-shield-alt" />
          </div>
          <div className="bkclaim-header-text">
            <h3>Report Issue Under Warranty</h3>
            <p>Booking #{booking.bookingNumber} • {booking.serviceRequestTitle || "Service"}</p>
          </div>
          <button type="button" className="bkclaim-close-btn" onClick={onClose} disabled={isLoading}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="bkclaim-warranty-banner">
          <div className="bkclaim-banner-stat">
            <span className="bkclaim-banner-label">Coverage Active</span>
            <span className="bkclaim-banner-value">{daysRemaining} Days Remaining</span>
          </div>
          <div className="bkclaim-banner-info">
            {warranty?.terms ? (
              <span><strong>Scope:</strong> {warranty.terms}</span>
            ) : null}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bkclaim-body">
            {errorMsg && (
              <div className="bkclaim-error-box">
                <i className="fas fa-exclamation-circle" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="bkclaim-field">
              <label>
                Describe What Went Wrong <span className="req">*</span>
              </label>
              <textarea
                className="bkclaim-textarea"
                rows={4}
                value={issueDescription}
                onChange={(e) => {
                  setIssueDescription(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                placeholder="Explain the recurring issue, defect, or parts not functioning properly..."
                required
                disabled={isLoading}
              />
            </div>

            <div className="bkclaim-grid-2">
              <div className="bkclaim-field">
                <label>Preferred Re-visit Date</label>
                <input
                  type="date"
                  className="bkclaim-input"
                  min={todayStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="bkclaim-field">
                <label>Preferred Time Slot</label>
                <select
                  className="bkclaim-select"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Select a preferred slot</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bkclaim-field">
              <label>Attach Photos / Evidence URLs (Optional, max 3)</label>
              <div className="bkclaim-photo-input-group">
                <input
                  type="url"
                  className="bkclaim-input"
                  placeholder="Paste image URL (e.g. image link)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  disabled={isLoading || proofImages.length >= 3}
                />
                <button
                  type="button"
                  className="bkclaim-btn-add-img"
                  onClick={handleAddImage}
                  disabled={isLoading || !imageUrlInput.trim() || proofImages.length >= 3}
                >
                  <i className="fas fa-plus" /> Add
                </button>
              </div>

              {proofImages.length > 0 && (
                <div className="bkclaim-thumbnails">
                  {proofImages.map((url, idx) => (
                    <div key={idx} className="bkclaim-thumbnail-item">
                      <img src={url} alt={`Evidence ${idx + 1}`} />
                      <button
                        type="button"
                        className="bkclaim-thumb-remove"
                        onClick={() => handleRemoveImage(idx)}
                        disabled={isLoading}
                      >
                        <i className="fas fa-trash-alt" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bkclaim-notice">
              <i className="fas fa-info-circle" />
              <span>
                Your service provider will review your claim within 24 hours. The scheduled re-visit is 100% free of charge under active warranty.
              </span>
            </div>
          </div>

          <div className="bkclaim-footer">
            <button
              type="button"
              className="bkclaim-btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bkclaim-btn-submit"
              disabled={isLoading || !issueDescription.trim()}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin" /> Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane" /> Submit Warranty Claim
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
