import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
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

interface FormErrors {
  revisitDate?: string;
  rejectionReason?: string;
  providerResponse?: string;
}

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
  const [providerResponse, setProviderResponse] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (isOpen && claim) {
      setRevisitDate(claim.preferredDate || todayStr);
      setProviderResponse("");
      setRejectionReason("");
      setPreviewModalImage(null);
      setErrors({});
      setTouched({});
    }
  }, [isOpen, claim, todayStr]);

  if (!isOpen || !booking || !claim) return null;

  const validateField = (
    field: "revisitDate" | "rejectionReason" | "providerResponse",
    value?: string
  ): string | undefined => {
    switch (field) {
      case "revisitDate": {
        if (mode !== "ACCEPT") return undefined;
        const val = value !== undefined ? value : revisitDate;
        if (!val) {
          return "Please select a date for the warranty re-visit";
        }
        if (val < todayStr) {
          return "Re-visit date cannot be in the past";
        }
        return undefined;
      }
      case "rejectionReason": {
        if (mode !== "REJECT") return undefined;
        const val = (value !== undefined ? value : rejectionReason).trim();
        if (!val) {
          return "Please provide a clear justification for disputing the claim";
        }
        if (val.length < 15) {
          return "Dispute justification must be at least 15 characters";
        }
        if (val.length > 1000) {
          return "Dispute justification cannot exceed 1000 characters";
        }
        return undefined;
      }
      case "providerResponse": {
        const val = (value !== undefined ? value : providerResponse).trim();
        if (val.length > 500) {
          return "Message cannot exceed 500 characters";
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleBlur = (field: "revisitDate" | "rejectionReason" | "providerResponse") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dateErr = validateField("revisitDate", revisitDate);
    const reasonErr = validateField("rejectionReason", rejectionReason);
    const respErr = validateField("providerResponse", providerResponse);

    const newErrors: FormErrors = {
      revisitDate: dateErr,
      rejectionReason: reasonErr,
      providerResponse: respErr
    };

    setErrors(newErrors);
    setTouched({
      revisitDate: true,
      rejectionReason: true,
      providerResponse: true
    });

    if (
      (mode === "ACCEPT" && dateErr) ||
      (mode === "REJECT" && reasonErr) ||
      respErr
    ) {
      toast.error("Please resolve highlighted form errors");
      return;
    }

    if (mode === "ACCEPT") {
      onSubmit({
        action: "ACCEPT",
        revisitScheduledDate: revisitDate,
        providerResponse: providerResponse.trim() || undefined
      });
    } else if (mode === "REJECT") {
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
    <div className="praction-overlay">
      <div className="praction-dialog" role="dialog" aria-modal="true">
        <div className={`praction-header ${mode === "REJECT" ? "praction-header-dispute" : ""}`}>
          <div className="praction-icon-wrap">
            <i className={`fas ${mode === "ACCEPT" ? "fa-calendar-check" : mode === "REJECT" ? "fa-balance-scale" : "fa-check-circle"}`} />
          </div>
          <div className="praction-header-text">
            <h3>
              {mode === "ACCEPT" && "Schedule Free Warranty Re-visit"}
              {mode === "REJECT" && "Dispute Warranty Claim"}
              {mode === "RESOLVE" && "Mark Warranty Service as Resolved"}
            </h3>
            <p>
              Booking #{booking.bookingNumber} • {booking.serviceRequestTitle || "Service"}
            </p>
          </div>
          <button type="button" className="praction-close-btn" onClick={onClose} disabled={isLoading} aria-label="Close">
            <i className="fas fa-times" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="praction-form">
          <div className="praction-body">
            <div className="praction-claim-summary">
              <div className="praction-summary-header">
                <span className="praction-summary-title">Customer Issue Report</span>
                <span className="praction-claim-badge">Active Claim</span>
              </div>
              <p className="praction-claim-desc">"{claim.issueDescription}"</p>
              
              {claim.preferredDate && (
                <div className="praction-claim-pref">
                  <i className="far fa-calendar-alt" />
                  <span>Available Until: <strong>{claim.preferredDate}</strong> {claim.preferredTime ? `(${claim.preferredTime})` : ""}</span>
                </div>
              )}

              {claim.proofImages && claim.proofImages.length > 0 && (
                <div className="praction-claim-photos">
                  <span className="praction-photos-title">Attached Photo Proof ({claim.proofImages.length}):</span>
                  <div className="praction-photos-grid">
                    {claim.proofImages.map((img, i) => (
                      <div
                        key={i}
                        className="praction-photo-thumb"
                        onClick={() => setPreviewModalImage(img)}
                        title="Click to view full photo"
                      >
                        <img src={img} alt={`Proof ${i + 1}`} />
                        <div className="praction-photo-overlay">
                          <i className="fas fa-search-plus" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {mode === "ACCEPT" && (
              <>
                <div className="praction-field">
                  <div className="praction-field-header">
                    <label>
                      Scheduled Re-visit Date <span className="req">*</span>
                    </label>
                  </div>
                  <input
                    type="date"
                    className={`praction-input ${touched.revisitDate && errors.revisitDate ? "has-error" : ""}`}
                    min={todayStr}
                    value={revisitDate}
                    onChange={(e) => {
                      setRevisitDate(e.target.value);
                      if (touched.revisitDate) {
                        const err = validateField("revisitDate", e.target.value);
                        setErrors((prev) => ({ ...prev, revisitDate: err }));
                      }
                    }}
                    onBlur={() => handleBlur("revisitDate")}
                    required
                    disabled={isLoading}
                  />
                  {touched.revisitDate && errors.revisitDate && (
                    <span className="praction-field-error">
                      <i className="fas fa-exclamation-circle" /> {errors.revisitDate}
                    </span>
                  )}
                </div>

                <div className="praction-field">
                  <div className="praction-field-header">
                    <label>Message to Customer (Optional)</label>
                    <span className={`praction-counter ${touched.providerResponse && errors.providerResponse ? "has-error" : ""}`}>
                      {providerResponse.length}/500
                    </span>
                  </div>
                  <textarea
                    className={`praction-textarea ${touched.providerResponse && errors.providerResponse ? "has-error" : ""}`}
                    rows={3}
                    maxLength={500}
                    value={providerResponse}
                    onChange={(e) => {
                      setProviderResponse(e.target.value);
                      if (touched.providerResponse) {
                        const err = validateField("providerResponse", e.target.value);
                        setErrors((prev) => ({ ...prev, providerResponse: err }));
                      }
                    }}
                    onBlur={() => handleBlur("providerResponse")}
                    placeholder="Provide any instructions or arrival timing details for the customer..."
                    disabled={isLoading}
                  />
                  {touched.providerResponse && errors.providerResponse && (
                    <span className="praction-field-error">
                      <i className="fas fa-exclamation-circle" /> {errors.providerResponse}
                    </span>
                  )}
                </div>

                <div className="praction-fee-notice">
                  <i className="fas fa-shield-alt" />
                  <div>
                    <strong>100% Free Re-visit:</strong> Warranty re-visits are provided at ₹0 extra fee to the customer as part of your completed job guarantee.
                  </div>
                </div>
              </>
            )}

            {mode === "REJECT" && (
              <>
                <div className="praction-field">
                  <div className="praction-field-header">
                    <label>
                      Dispute Reason / Justification <span className="req">*</span>
                    </label>
                    <span className={`praction-counter ${touched.rejectionReason && errors.rejectionReason ? "has-error" : ""}`}>
                      {rejectionReason.trim().length}/1000 (min 15)
                    </span>
                  </div>
                  <textarea
                    className={`praction-textarea ${touched.rejectionReason && errors.rejectionReason ? "has-error" : ""}`}
                    rows={4}
                    maxLength={1000}
                    value={rejectionReason}
                    onChange={(e) => {
                      setRejectionReason(e.target.value);
                      if (touched.rejectionReason) {
                        const err = validateField("rejectionReason", e.target.value);
                        setErrors((prev) => ({ ...prev, rejectionReason: err }));
                      }
                    }}
                    onBlur={() => handleBlur("rejectionReason")}
                    placeholder="Explain clearly why this issue is not covered under the original warranty terms (e.g. user physical damage, new unrelated failure, third-party tampering)..."
                    required
                    disabled={isLoading}
                  />
                  {touched.rejectionReason && errors.rejectionReason && (
                    <span className="praction-field-error">
                      <i className="fas fa-exclamation-circle" /> {errors.rejectionReason}
                    </span>
                  )}
                </div>

                <div className="praction-dispute-warning">
                  <i className="fas fa-balance-scale" />
                  <div>
                    <strong>Admin Support Investigation:</strong> Disputing this claim will immediately escalate this case to our Admin team. Admin will review the job evidence, diagnosis notes, and communicate with both parties.
                  </div>
                </div>
              </>
            )}

            {mode === "RESOLVE" && (
              <div className="praction-resolve-box">
                <i className="fas fa-check-circle" />
                <p>
                  Confirm that the warranty re-work has been completed satisfactorily on site.
                </p>
                <div className="praction-field">
                  <div className="praction-field-header">
                    <label>Resolution Summary (Optional)</label>
                    <span className={`praction-counter ${touched.providerResponse && errors.providerResponse ? "has-error" : ""}`}>
                      {providerResponse.length}/500
                    </span>
                  </div>
                  <textarea
                    className={`praction-textarea ${touched.providerResponse && errors.providerResponse ? "has-error" : ""}`}
                    rows={3}
                    maxLength={500}
                    value={providerResponse}
                    onChange={(e) => {
                      setProviderResponse(e.target.value);
                      if (touched.providerResponse) {
                        const err = validateField("providerResponse", e.target.value);
                        setErrors((prev) => ({ ...prev, providerResponse: err }));
                      }
                    }}
                    onBlur={() => handleBlur("providerResponse")}
                    placeholder="Briefly state what was corrected or repaired..."
                    disabled={isLoading}
                  />
                  {touched.providerResponse && errors.providerResponse && (
                    <span className="praction-field-error">
                      <i className="fas fa-exclamation-circle" /> {errors.providerResponse}
                    </span>
                  )}
                </div>
              </div>
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
              className={`praction-btn-submit ${mode === "REJECT" ? "danger" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin" /> Processing...
                </>
              ) : mode === "ACCEPT" ? (
                <>
                  <i className="fas fa-calendar-check" /> Confirm Free Re-visit
                </>
              ) : mode === "REJECT" ? (
                <>
                  <i className="fas fa-exclamation-triangle" /> Escalate Dispute
                </>
              ) : (
                <>
                  <i className="fas fa-check-double" /> Complete Warranty Service
                </>
              )}
            </button>
          </div>
        </form>

        {previewModalImage && (
          <div className="praction-lightbox-overlay" onClick={() => setPreviewModalImage(null)}>
            <div className="praction-lightbox-box" onClick={(e) => e.stopPropagation()}>
              <img src={previewModalImage} alt="Proof Full View" />
              <button
                type="button"
                className="praction-lightbox-close"
                onClick={() => setPreviewModalImage(null)}
              >
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
