import React, { useState, useEffect } from 'react';
import { AdminModal } from './AdminModal';

interface BlockReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userId: string;
  isLoading?: boolean;
  onConfirm: (reason: string) => void;
}

export const BlockReasonModal: React.FC<BlockReasonModalProps> = ({
  isOpen,
  onClose,
  userName,
  userId,
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
    const trimmedReason = reason.trim();
    if (!trimmedReason) {
      setError("Please provide a reason for suspension.");
      return;
    }
    onConfirm(trimmedReason);
  };

  const footer = (
    <div className="flex justify-end gap-2 w-full">
      <button type="button" className="btn btn-secondary text-xs" onClick={onClose} disabled={isLoading}>
        Cancel
      </button>
      <button type="button" className="btn btn-danger text-xs" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-1">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Proceeding...</span>
          </span>
        ) : (
          "Proceed to Block"
        )}
      </button>
    </div>
  );

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Account Suspension"
      icon="fas fa-exclamation-triangle"
      footer={footer}
    >
      <div className="space-y-4">
        <p className="text-sm mb-3 text-text">
          Are you sure you want to suspend <strong className="text-text font-semibold">{userName}</strong> (<span className="font-mono text-xs text-muted">#{userId.slice(0, 8)}</span>)?
        </p>

        <div className="form-group mb-3">
          <label className="form-label text-xs font-semibold text-secondary mb-1">
            Reason for Suspension <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control text-xs w-full p-2 border border-border rounded bg-surface text-text"
            rows={4}
            placeholder="Enter the reason for suspending this account..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError("");
            }}
          />
          {error && <p className="text-xs text-danger mt-1">{error}</p>}
        </div>

        <div className="p-3 bg-danger-light border border-danger rounded text-xs text-danger flex items-start gap-2">
          <i className="fas fa-info-circle mt-0.5"></i>
          <span>Suspended users will immediately lose platform access until reinstated by an administrator.</span>
        </div>
      </div>
    </AdminModal>
  );
};
