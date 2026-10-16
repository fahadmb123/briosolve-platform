import React, { useState, useEffect } from "react";
import { AdminModal } from "../../components/AdminModal";

interface RejectKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  isLoading?: boolean;
  onConfirm: (reason: string) => void;
}

export const RejectKycModal: React.FC<RejectKycModalProps> = ({
  isOpen,
  onClose,
  providerName,
  isLoading = false,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (()=>{
      if (isOpen) {
        setReason("");
        setError("");
      }
    })()
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("Please specify the rejection reason for the provider.");
      return;
    }
    onConfirm(trimmed);
  };

  const footer = (
    <div className="flex justify-end gap-2 w-full">
      <button
        type="button"
        className="btn btn-secondary text-xs"
        onClick={onClose}
        disabled={isLoading}
      >
        Cancel
      </button>
      <button
        type="button"
        className="btn btn-danger text-xs font-semibold"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Rejecting...</span>
          </span>
        ) : (
          "Confirm Rejection"
        )}
      </button>
    </div>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Verification Application"
      icon="fas fa-times-circle"
      footer={footer}
    >
      <div className="space-y-4">
        <p className="text-sm text-text mb-2">
          Rejecting verification for{" "}
          <strong className="font-semibold text-text">{providerName}</strong>.
          The provider will be notified with your feedback to re-upload their credentials.
        </p>

        <div className="form-group">
          <label className="form-label text-xs font-semibold text-secondary mb-1">
            Rejection Feedback / Reason <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control text-xs w-full p-2.5 border border-border rounded bg-surface text-text"
            rows={4}
            placeholder="e.g. Uploaded trade license is expired or blurry. Please upload a clear valid certificate."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
          />
          {error && <p className="text-xs text-danger mt-1">{error}</p>}
        </div>

        <div className="p-3 bg-danger-light border border-danger/20 rounded text-xs text-danger flex items-start gap-2">
          <i className="fas fa-info-circle mt-0.5"></i>
          <span>
            This rejection reason will be visible on the provider's KYC status screen so they can resubmit valid documents.
          </span>
        </div>
      </div>
    </AdminModal>
  );
};
