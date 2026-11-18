import React, { useState } from "react";
import type { BookingItem, BookingStatus } from "../../types/booking.types";
import "./BookingStatusModal.css";

interface BookingStatusModalProps {
  booking: BookingItem | null;
  targetStatus: BookingStatus | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (booking: BookingItem, newStatus: BookingStatus, notes?: string) => void;
}

export const BookingStatusModal: React.FC<BookingStatusModalProps> = ({
  booking,
  targetStatus,
  isOpen,
  isLoading,
  onClose,
  onConfirm
}) => {
  const [notes, setNotes] = useState("");

  if (!isOpen || !booking || !targetStatus) return null;

  const isStarting = targetStatus === "IN_PROGRESS";
  const isCompleting = targetStatus === "COMPLETED";

  const title = isStarting
    ? "Start Job Execution?"
    : isCompleting
    ? "Confirm Job Completion?"
    : "Update Booking Status";

  const description = isStarting
    ? `You are about to mark "${booking.serviceRequestTitle || "this booking"}" as In Progress. The customer will be informed that work has commenced.`
    : isCompleting
    ? `Confirm that all deliverables for "${booking.serviceRequestTitle || "this job"}" have been completed to satisfaction. The customer will be notified to review and release escrow.`
    : `Update status for booking ${booking.bookingNumber}.`;

  const handleConfirm = () => {
    onConfirm(booking, targetStatus, notes.trim() || undefined);
  };

  return (
    <div className="bkstatus-modal-overlay" onClick={onClose}>
      <div
        className="bkstatus-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="bkstatus-modal-header">
          <div className={`bkstatus-icon-box ${isCompleting ? "success" : "primary"}`}>
            <i className={isCompleting ? "fas fa-check-double" : "fas fa-play"}></i>
          </div>
          <h3 className="bkstatus-title">{title}</h3>
          <p className="bkstatus-desc">{description}</p>
        </div>

        <div className="bkstatus-modal-body">
          <label className="bkstatus-label" htmlFor="status-notes">
            Optional Notes / Updates for Client
          </label>
          <textarea
            id="status-notes"
            className="bkstatus-textarea"
            rows={3}
            placeholder={
              isStarting
                ? "e.g., Arrived at location, commencing diagnostic inspection..."
                : "e.g., Work finished, all test runs completed successfully..."
            }
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="bkstatus-modal-footer">
          <button
            type="button"
            className="bkstatus-btn-cancel"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`bkstatus-btn-confirm ${isCompleting ? "success" : "primary"}`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Updating...</span>
              </>
            ) : isCompleting ? (
              <>
                <i className="fas fa-check"></i>
                <span>Mark Completed</span>
              </>
            ) : (
              <>
                <i className="fas fa-play"></i>
                <span>Start Job</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
