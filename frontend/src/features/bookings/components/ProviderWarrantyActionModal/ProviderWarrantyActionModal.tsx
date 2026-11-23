import React, { useState, useEffect } from "react";
import type { BookingItem, WarrantyClaimDetails } from "../../types/booking.types";
import "./ProviderWarrantyActionModal.css";

interface ProviderWarrantyActionModalProps {
  isOpen: boolean;
  booking: BookingItem | null;
  mode: "ACCEPT" | "REJECT" | "RESOLVE";
  onClose: () => void;
  onSubmit: (payload: {
    action: "ACCEPT" | "REJECT" | "RESOLVE";
    revisitScheduledDate?: string;
    revisitScheduledTime?: string;
    providerResponse?: string;
    rejectionReason?: string;
  }) => void;
  isLoading?: boolean;
}

const TIME_SLOTS = [
  "Morning (09:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 04:00 PM)",
  "Evening (04:00 PM - 07:00 PM)"
];

export const ProviderWarrantyActionModal: React.FC<ProviderWarrantyActionModalProps> = ({
  isOpen,
  booking,
  mode,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const claim: WarrantyClaimDetails | undefined | null = booking?.warranty?.claim;

  const [revisitDate, setRevisitDate] = useState("");
  const [revisitTime, setRevisitTime] = useState("");
  const [providerResponse, setProviderResponse] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen) {
      setRevisitDate(claim?.preferredDate || todayStr);
      setRevisitTime(claim?.preferredTime || TIME_SLOTS[0]);
      setProviderResponse("");
      setRejectionReason("");
      setErrorMsg("");
    }
  }, [isOpen, claim, todayStr]);

  if (!isOpen || !booking || !claim) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (mode === "ACCEPT") {
      if (!revisitDate) {
        setErrorMsg("Please select a date for the warranty re-visit");
        return;
      }
      onSubmit({
        action: "ACCEPT",
        revisitScheduledDate: revisitDate,
        revisitScheduledTime: revisitTime || undefined,
        providerResponse: providerResponse.trim() || undefined
      });
    } else if (mode === "REJECT") {
      if (!rejectionReason.trim()) {
        setErrorMsg("Please explain why this claim is being disputed");
        return;
      }
      onSubmit({
        action: "REJECT",
        rejectionReason: rejectionReason.trim(),
        providerResponse: providerResponse.trim() || undefined
      });
    } else if (mode === "RESOLVE") {
      onSubmit({
        action: "RESOLVE",
        providerResponse: providerResponse.trim() || undefined
      });
    }
  };

  return (
    <div className="praction-overlay" onClick={onClose}>
      <div className="praction-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={`praction-header ${mode === "REJECT" ? "praction-header-dispute" : ""}`}>
          <div className="praction-icon-wrap">
            <i className={`fas ${mode === "ACCEPT" ? "fa-calendar-check" : mode === "REJECT" ? "fa-balance-scale" : "fa-check-circle"}`} />
          </div>
          <div className="praction-header-text">
            <h3>
              {mode === "ACCEPT" && "Schedule Free Warranty Re-visit"}
              {mode === "REJECT" && "Dispute Warranty Claim (Escalate to Admin)"}
              {mode === "RESOLVE" && "Mark Warranty Service as Resolved"}
            </h3>
            <p>Booking #{booking.bookingNumber} • {booking.serviceRequestTitle || "Service"}</p>
          </div>
          <button type="button" className="praction-close-btn" onClick={onClose} disabled={isLoading}>
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="praction-body">
            {errorMsg && (
              <div className="praction-error-box">
                <i className="fas fa-exclamation-circle" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="praction-claim-summary">
              <span className="praction-summary-title">Customer Claim Details:</span>
              <p className="praction-claim-desc">"{claim.issueDescription}"</p>
              {claim.preferredDate && (
                <div className="praction-claim-pref">
                  <i className="far fa-clock" /> Customer Preferred: {claim.preferredDate} {claim.preferredTime ? `(${claim.preferredTime})` : ""}
                </div>
              )}
            </div>

            {mode === "ACCEPT" && (
              <>
                <div className="praction-grid-2">
                  <div className="praction-field">
                    <label>
                      Scheduled Re-visit Date <span className="req">*</span>
                    </label>
                    <input
                      type="date"
                      className="praction-input"
                      min={todayStr}
                      value={revisitDate}
                      onChange={(e) => setRevisitDate(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="praction-field">
                    <label>Arrival Time Window</label>
                    <select
                      className="praction-select"
                      value={revisitTime}
                      onChange={(e) => setRevisitTime(e.target.value)}
                      disabled={isLoading}
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="praction-field">
                  <label>Message to Customer (Optional)</label>
                  <textarea
                    className="praction-textarea"
                    rows={3}
                    value={providerResponse}
                    onChange={(e) => setProviderResponse(e.target.value)}
                    placeholder="Provide any instructions or confirmation details for the customer..."
                    disabled={isLoading}
                  />
                </div>

                <div className="praction-fee-notice">
                  <i className="fas fa-shield-alt" />
                  <span>
                    Warranty re-visits are provided at ₹0 extra fee to the customer as part of your completed job guarantee.
                  </span>
                </div>
              </>
            )}

            {mode === "REJECT" && (
              <>
                <div className="praction-field">
                  <label>
                    Dispute Reason / Justification <span className="req">*</span>
                  </label>
                  <textarea
                    className="praction-textarea"
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain clearly why this issue is not covered under the original warranty terms (e.g. user physical damage, new unrelated failure, third-party tampering)..."
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="praction-escalation-notice">
                  <i className="fas fa-gavel" />
                  <div>
                    <strong>Admin Support Investigation:</strong> Disputing this claim will immediately escalate this case to our Admin team. Admin will review the job evidence, diagnosis notes, and communicate with both parties.
                  </div>
                </div>
              </>
            )}

            {mode === "RESOLVE" && (
              <>
                <div className="praction-field">
                  <label>Resolution Summary (Optional)</label>
                  <textarea
                    className="praction-textarea"
                    rows={3}
                    value={providerResponse}
                    onChange={(e) => setProviderResponse(e.target.value)}
                    placeholder="Summarize the corrective work completed during the warranty re-visit..."
                    disabled={isLoading}
                  />
                </div>

                <div className="praction-fee-notice">
                  <i className="fas fa-check-double" />
                  <span>
                    Marking this claim as resolved will confirm completion of the warranty re-visit and update the customer record.
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="praction-footer">
            <button
              type="button"
              className="praction-btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`praction-btn-submit ${mode === "REJECT" ? "praction-btn-danger" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin" /> Processing...
                </>
              ) : mode === "ACCEPT" ? (
                <>
                  <i className="fas fa-check" /> Confirm Free Re-visit
                </>
              ) : mode === "REJECT" ? (
                <>
                  <i className="fas fa-exclamation-triangle" /> Escalate Dispute
                </>
              ) : (
                <>
                  <i className="fas fa-check" /> Confirm Resolved
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
