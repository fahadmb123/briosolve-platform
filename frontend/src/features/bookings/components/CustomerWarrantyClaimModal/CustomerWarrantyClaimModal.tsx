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

interface FormErrors {
  issueDescription?: string;
  preferredDate?: string;
  preferredTime?: string;
  proofImages?: string;
}

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
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
      setErrors({});
      setTouched({});
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const validateField = (field: keyof FormErrors, value?: any): string | undefined => {
    switch (field) {
      case "issueDescription": {
        const val = (value !== undefined ? value : issueDescription).trim();
        if (!val) {
          return "Please describe the issue encountered with the service";
        }
        if (val.length < 15) {
          return "Please provide at least 15 characters explaining the issue in detail";
        }
        if (val.length > 1000) {
          return "Description cannot exceed 1000 characters";
        }
        return undefined;
      }
      case "preferredDate": {
        const val = value !== undefined ? value : preferredDate;
        if (val) {
          if (val < todayStr) {
            return "Available date cannot be in the past";
          }
          if (maxDateStr && val > maxDateStr) {
            return "Date cannot exceed your active warranty expiration date";
          }
        }
        return undefined;
      }
      case "preferredTime": {
        const val = value !== undefined ? value : preferredTime;
        if (val && !TIME_SLOTS.includes(val)) {
          return "Please select a valid time slot from the list";
        }
        return undefined;
      }
      case "proofImages": {
        const val = value !== undefined ? value : proofImages;
        if (val && val.length > 3) {
          return "Maximum 3 photos allowed";
        }
        return undefined;
      }
      default:
        return undefined;
    }
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field);
    setErrors((prev) => ({
      ...prev,
      [field]: err
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const currentCount = proofImages.length;
    if (currentCount >= 3) {
      toast.error("Maximum 3 photos allowed");
      setErrors((prev) => ({ ...prev, proofImages: "Maximum 3 photos allowed" }));
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
    setProofImages((prev) => {
      const next = [...prev, ...newImages].slice(0, 3);
      setErrors((errs) => ({ ...errs, proofImages: undefined }));
      return next;
    });
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setProofImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setErrors((errs) => ({ ...errs, proofImages: undefined }));
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const descErr = validateField("issueDescription", issueDescription);
    const dateErr = validateField("preferredDate", preferredDate);
    const timeErr = validateField("preferredTime", preferredTime);
    const imgErr = validateField("proofImages", proofImages);

    const newErrors: FormErrors = {
      issueDescription: descErr,
      preferredDate: dateErr,
      preferredTime: timeErr,
      proofImages: imgErr
    };

    setErrors(newErrors);
    setTouched({
      issueDescription: true,
      preferredDate: true,
      preferredTime: true,
      proofImages: true
    });

    if (descErr || dateErr || timeErr || imgErr) {
      toast.error("Please resolve highlighted form errors");
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="bkclaim-body">
            <div className="bkclaim-field">
              <div className="bkclaim-field-header">
                <label>
                  Describe What Went Wrong <span className="req">*</span>
                </label>
                <span className="bkclaim-count-pill">{issueDescription.length}/1000</span>
              </div>
              <textarea
                className={`bkclaim-textarea ${touched.issueDescription && errors.issueDescription ? "has-error" : ""}`}
                rows={4}
                value={issueDescription}
                onChange={(e) => {
                  const val = e.target.value;
                  setIssueDescription(val);
                  if (touched.issueDescription) {
                    setErrors((prev) => ({ ...prev, issueDescription: validateField("issueDescription", val) }));
                  }
                }}
                onBlur={() => handleBlur("issueDescription")}
                placeholder="Explain the recurring issue, defect, or parts not functioning properly in detail..."
                required
                disabled={isLoading}
              />
              {touched.issueDescription && errors.issueDescription && (
                <span className="bkclaim-field-error">
                  <i className="fas fa-exclamation-circle" /> {errors.issueDescription}
                </span>
              )}
            </div>

            <div className="bkclaim-grid-2">
              <div className="bkclaim-field">
                <label>Available Any Day Until</label>
                <input
                  type="date"
                  className={`bkclaim-input ${touched.preferredDate && errors.preferredDate ? "has-error" : ""}`}
                  min={todayStr}
                  max={maxDateStr}
                  value={preferredDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPreferredDate(val);
                    if (touched.preferredDate) {
                      setErrors((prev) => ({ ...prev, preferredDate: validateField("preferredDate", val) }));
                    }
                  }}
                  onBlur={() => handleBlur("preferredDate")}
                  disabled={isLoading}
                />
                {touched.preferredDate && errors.preferredDate ? (
                  <span className="bkclaim-field-error">
                    <i className="fas fa-exclamation-circle" /> {errors.preferredDate}
                  </span>
                ) : (
                  <span className="bkclaim-field-hint">
                    Technician can re-visit any day on or before this date
                  </span>
                )}
              </div>

              <div className="bkclaim-field">
                <label>General Time Availability</label>
                <select
                  className={`bkclaim-select ${touched.preferredTime && errors.preferredTime ? "has-error" : ""}`}
                  value={preferredTime}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPreferredTime(val);
                    if (touched.preferredTime) {
                      setErrors((prev) => ({ ...prev, preferredTime: validateField("preferredTime", val) }));
                    }
                  }}
                  onBlur={() => handleBlur("preferredTime")}
                  disabled={isLoading}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {touched.preferredTime && errors.preferredTime ? (
                  <span className="bkclaim-field-error">
                    <i className="fas fa-exclamation-circle" /> {errors.preferredTime}
                  </span>
                ) : (
                  <span className="bkclaim-field-hint">
                    Your daily convenient time window for re-visits
                  </span>
                )}
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
                className={`bkclaim-dropzone ${proofImages.length >= 3 ? "disabled" : ""} ${errors.proofImages ? "has-error" : ""}`}
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

              {errors.proofImages && (
                <span className="bkclaim-field-error">
                  <i className="fas fa-exclamation-circle" /> {errors.proofImages}
                </span>
              )}

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
              disabled={isLoading}
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
