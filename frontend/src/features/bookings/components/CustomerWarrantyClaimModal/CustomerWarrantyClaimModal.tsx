import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
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
  "Anytime / Flexible (Fastest Re-visit)",
  "Morning (09:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 04:00 PM)",
  "Evening (04:00 PM - 07:00 PM)",
  "Weekends Only"
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
  const [preferredTime, setPreferredTime] = useState(TIME_SLOTS[0]);
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const warranty = booking?.warranty;
  const daysRemaining = warranty?.expiresAt
    ? Math.max(0, Math.ceil((new Date(warranty.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : (warranty?.days || 0);

  const todayStr = new Date().toISOString().split("T")[0];
  const maxDateStr = warranty?.expiresAt
    ? new Date(warranty.expiresAt).toISOString().split("T")[0]
    : undefined;

  useEffect(() => {
    if (isOpen) {
      setIssueDescription("");
      setPreferredDate("");
      setPreferredTime(TIME_SLOTS[0]);
      setProofImages([]);
      setPreviewModalImage(null);
      setErrorMsg("");
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const currentCount = proofImages.length;
    if (currentCount >= 3) {
      toast.error("Maximum 3 photos allowed");
      e.target.value = "";
      return;
    }

    const rawFiles = Array.from(files);
    const validFiles: File[] = [];
    for (const file of rawFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not a supported image file`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds the 10MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    const availableSlots = 3 - currentCount;
    if (validFiles.length > availableSlots) {
      toast.error(`Only up to 3 photos allowed. Adding the first ${availableSlots}.`);
    }

    const filesToRead = validFiles.slice(0, availableSlots);
    if (filesToRead.length === 0) {
      e.target.value = "";
      return;
    }

    const readPromises = filesToRead.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        })
    );

    const newImages = await Promise.all(readPromises);
    setProofImages((prev) => [...prev, ...newImages].slice(0, 3));
    e.target.value = "";
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
                <label>Available Any Day Until</label>
                <input
                  type="date"
                  className="bkclaim-input"
                  min={todayStr}
                  max={maxDateStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  disabled={isLoading}
                />
                <span className="bkclaim-field-hint">
                  Technician can re-visit any day on or before this date
                </span>
              </div>

              <div className="bkclaim-field">
                <label>General Time Availability</label>
                <select
                  className="bkclaim-select"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  disabled={isLoading}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                <span className="bkclaim-field-hint">
                  Your daily convenient time window for re-visits
                </span>
              </div>
            </div>

            <div className="bkclaim-field">
              <div className="bkclaim-field-header">
                <label>Photos of the Issue (Max 3)</label>
                <span className="bkclaim-count-pill">{proofImages.length}/3</span>
              </div>

              <input
                type="file"
                id="bkclaim-file-upload"
                multiple
                accept="image/png, image/jpeg, image/webp"
                style={{ display: "none" }}
                onChange={handleFileUpload}
                disabled={isLoading || proofImages.length >= 3}
              />

              <label
                htmlFor={proofImages.length >= 3 || isLoading ? undefined : "bkclaim-file-upload"}
                className={`bkclaim-dropzone ${proofImages.length >= 3 ? "disabled" : ""}`}
              >
                <div className="bkclaim-dropzone-icon">
                  <i className={`fas ${proofImages.length >= 3 ? "fa-check-circle text-success" : "fa-cloud-upload-alt"}`} />
                </div>
                <div className="bkclaim-dropzone-text">
                  {proofImages.length >= 3 ? "Maximum 3 photos uploaded" : "Click or drag photos of the issue here"}
                </div>
                <div className="bkclaim-dropzone-sub">
                  Supports JPG, PNG, WEBP (up to 10MB each)
                </div>
              </label>

              {proofImages.length > 0 && (
                <div className="bkclaim-preview-grid">
                  {proofImages.map((src, idx) => (
                    <div
                      key={idx}
                      className="bkclaim-preview-item"
                      onClick={() => setPreviewModalImage(src)}
                      title="Click to view image"
                    >
                      <img src={src} alt={`Upload ${idx + 1}`} />
                      <div className="bkclaim-preview-overlay">
                        <i className="fas fa-search-plus" />
                      </div>
                      <button
                        type="button"
                        className="bkclaim-preview-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(idx);
                        }}
                        disabled={isLoading}
                        title="Remove photo"
                      >
                        <i className="fas fa-times" />
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

        {previewModalImage && (
          <div className="bkclaim-lightbox-overlay" onClick={() => setPreviewModalImage(null)}>
            <div className="bkclaim-lightbox-box" onClick={(e) => e.stopPropagation()}>
              <img src={previewModalImage} alt="Photo Preview" />
              <button
                type="button"
                className="bkclaim-lightbox-close"
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
