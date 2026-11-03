import React from "react";
import type { CustomerServiceRequestItem } from "../../../types/serviceRequest.types";

interface CancelConfirmModalProps {
  request: CustomerServiceRequestItem | null;
  isOpen: boolean;
  isCancelling: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  request,
  isOpen,
  isCancelling,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="myreq-modal-overlay" onClick={onClose}>
      <div
        className="myreq-cancel-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="myreq-cancel-icon-badge">
          <i className="fas fa-exclamation-triangle"></i>
        </div>

        <h3 className="myreq-cancel-title">Cancel Service Request?</h3>

        <p className="myreq-cancel-message">
          Are you sure you want to cancel <strong>"{request.title}"</strong>? Once cancelled, matched providers will no longer submit quotes for this job.
        </p>

        <div className="myreq-cancel-actions">
          <button
            type="button"
            className="myreq-btn-cancel-keep"
            onClick={onClose}
            disabled={isCancelling}
          >
            No, Keep Request
          </button>

          <button
            type="button"
            className="myreq-btn-cancel-confirm"
            onClick={onConfirm}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Cancelling...</span>
              </>
            ) : (
              <>
                <i className="fas fa-trash-alt"></i>
                <span>Yes, Cancel</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

