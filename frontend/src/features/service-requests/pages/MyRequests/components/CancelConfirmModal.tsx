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
        className="myreq-confirm-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="myreq-confirm-icon-box">
          <i className="fas fa-exclamation-triangle"></i>
        </div>

        <h3 className="myreq-confirm-headline">Cancel Service Request?</h3>

        <p className="myreq-confirm-explanation">
          Are you sure you want to cancel <strong>"{request.title}"</strong>? Once cancelled, active providers won't be able to submit quotes for this job.
        </p>

        <div className="myreq-confirm-action-row">
          <button
            type="button"
            className="myreq-btn-subtle"
            onClick={onClose}
            disabled={isCancelling}
          >
            Keep Request
          </button>

          <button
            type="button"
            className="myreq-btn-confirm-cancel"
            onClick={onConfirm}
            disabled={isCancelling}
          >
            {isCancelling ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Cancelling...</span>
              </>
            ) : (
              "Yes, Cancel Request"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
