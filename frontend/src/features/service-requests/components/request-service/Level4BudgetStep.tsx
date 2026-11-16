import { useState, type ChangeEvent } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ServiceRequestInputType } from "../../schemas/serviceRequest.schema";

interface Level4BudgetStepProps {
  fileInputId: string;
  uploadedImages: string[];
  register: UseFormRegister<ServiceRequestInputType>;
  errors: FieldErrors<ServiceRequestInputType>;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onPrev: () => void;
  budgetType?: "OPEN_BID" | "FIXED";
  onSelectBudgetType?: (type: "OPEN_BID" | "FIXED") => void;
  onPresetBudget?: (amount: string) => void;
}

export function Level4BudgetStep({
  fileInputId,
  uploadedImages,
  register,
  errors,
  onFileUpload,
  onRemoveImage,
  onPrev,
}: Level4BudgetStepProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  return (
    <div className="request-section-card">
      <div className="request-section-header">
        <div className="request-step-badge">4</div>
        <div className="request-section-title-group">
          <h2>Level 4: Photos & Policy Agreement</h2>
          <p>Attach photos of the requirement and review marketplace policy</p>
        </div>
      </div>

      <div className="request-form-group">
        <label className="request-form-label">
          <span>
            Photos & Media <span className="required-dot">*</span>
          </span>
          <span className="char-count">{uploadedImages.length}/5</span>
        </label>

        <input
          type="file"
          id={fileInputId}
          multiple
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={onFileUpload}
          disabled={uploadedImages.length >= 5}
        />

        <label
          htmlFor={uploadedImages.length >= 5 ? undefined : fileInputId}
          className={`file-dropzone ${errors.images ? "border-danger" : ""} ${uploadedImages.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className="dropzone-icon">
            <i className={`fas ${uploadedImages.length >= 5 ? "fa-check-circle text-success" : "fa-cloud-upload-alt"}`}></i>
          </div>
          <div className="dropzone-text-main">
            {uploadedImages.length >= 5 ? "Maximum 5 images uploaded" : "Click or drag images here to upload"}
          </div>
          <div className="dropzone-text-sub">
            {uploadedImages.length >= 5 ? "Remove an image below if you want to upload a different one" : "Supports JPG, PNG up to 10MB each (at least 1, max 5 images)"}
          </div>
        </label>
        {errors.images && (
          <span className="text-danger text-xs mt-1 block">
            {errors.images.message}
          </span>
        )}

        {uploadedImages.length > 0 && (
          <div className="uploaded-preview-grid">
            {uploadedImages.map((imgSrc, idx) => (
              <div
                key={idx}
                className="uploaded-preview-item"
                onClick={() => setPreviewImage(imgSrc)}
                title="Click to view image"
              >
                <img src={imgSrc} alt={`Upload ${idx + 1}`} />
                <div className="uploaded-preview-overlay">
                  <i className="fas fa-search-plus"></i>
                </div>
                <button
                  type="button"
                  className="remove-upload-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(idx);
                  }}
                  title="Remove image"
                  aria-label="Remove image"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="request-policy-card">
        <div className="request-policy-header">
          <i className="fas fa-shield-alt"></i>
          <span>Marketplace Policy & Workflow</span>
        </div>
        <div className="request-policy-steps">
          <div className="request-policy-step">
            <span className="policy-step-number">1</span>
            <p>
              <strong>Review & Quotations:</strong> Once posted, verified local specialists will review your request and submit quotations detailing their price and availability.
            </p>
          </div>
          <div className="request-policy-step">
            <span className="policy-step-number">2</span>
            <p>
              <strong>Choose & Accept:</strong> Compare received quotes, inspect provider credentials, and accept the offer that fits your preferences.
            </p>
          </div>
          <div className="request-policy-step">
            <span className="policy-step-number">3</span>
            <p>
              <strong>Advance & Platform Fee:</strong> To confirm and seal the contract upon accepting a quotation, you will pay the initial advance amount. Note: This advance includes the 10% platform service fee.
            </p>
          </div>
        </div>

        <label className="request-policy-checkbox-label">
          <input
            type="checkbox"
            className="request-policy-checkbox"
            {...register("agreedToPolicy")}
          />
          <span>
            I understand and agree to the request flow, quotation acceptance terms, and the 10% platform fee included in the initial advance payment.
          </span>
        </label>
        {errors.agreedToPolicy && (
          <span className="text-danger text-xs mt-1 block">
            {errors.agreedToPolicy.message}
          </span>
        )}
      </div>

      <div className="level-navigation-bar">
        <button
          type="button"
          className="level-nav-back-btn"
          onClick={onPrev}
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to Level 3</span>
        </button>
      </div>

      {previewImage && (
        <div
          className="req-lightbox-overlay"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="req-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewImage}
              alt="Uploaded preview"
              className="req-lightbox-img"
            />
            <button
              type="button"
              className="req-lightbox-close"
              onClick={() => setPreviewImage(null)}
              aria-label="Close image preview"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
