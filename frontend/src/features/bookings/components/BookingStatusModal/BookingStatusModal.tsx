import React, { useState } from "react";
import type { BookingItem, BookingStatus } from "../../types/booking.types";
import "./BookingStatusModal.css";

interface BookingStatusModalProps {
  booking: BookingItem | null;
  targetStatus: BookingStatus | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (booking: BookingItem, newStatus: BookingStatus, notes?: string, totalAmount?: number) => void;
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
  const [confirmedAmount, setConfirmedAmount] = useState<number>(() => booking?.totalAmount || 0);

  React.useEffect(() => {
    if (booking?.totalAmount) {
      setConfirmedAmount(booking.totalAmount);
    }
  }, [booking?.totalAmount, isOpen]);

  if (!isOpen || !booking || !targetStatus) return null;

  const getStatusConfig = () => {
    switch (targetStatus) {
      case "EN_ROUTE":
        return {
          title: "Technician On The Way?",
          description: `You are about to notify the customer that you are en route to their address for "${booking.serviceRequestTitle || "this booking"}".`,
          placeholder: "e.g., On my way, estimated arrival in 25 minutes...",
          confirmText: "I am On The Way",
          confirmIcon: "fas fa-route",
          variant: "route"
        };
      case "INSPECTION":
        return {
          title: "Start Inspection / Diagnostics?",
          description: `You are about to mark "${booking.serviceRequestTitle || "this booking"}" as under Inspection. The customer will be informed that on-site diagnostic or inspection has begun.`,
          placeholder: "e.g., Arrived on site, checking components and reviewing requirements...",
          confirmText: "Start Inspection",
          confirmIcon: "fas fa-clipboard-check",
          variant: "inspection"
        };
      case "IN_PROGRESS":
        return {
          title: "Start Job Execution?",
          description: `You are about to mark "${booking.serviceRequestTitle || "this booking"}" as In Progress. The customer will be informed that work has commenced.`,
          placeholder: "e.g., Commencing work and repairs as per agreement...",
          confirmText: "Start Work",
          confirmIcon: "fas fa-tools",
          variant: "primary"
        };
      case "PAYMENT_PENDING":
        return {
          title: "Confirm Total Payment Amount?",
          description: `Confirm the final total amount for "${booking.serviceRequestTitle || "this job"}". The customer will be notified to review and settle the remaining balance.`,
          placeholder: "e.g., Job executed completely. Final price verified and ready for settlement...",
          confirmText: "Confirm Total & Request Payment",
          confirmIcon: "fas fa-file-invoice-dollar",
          variant: "warning"
        };
      case "COMPLETED":
        return {
          title: "Confirm Job Completion?",
          description: `Confirm that all deliverables for "${booking.serviceRequestTitle || "this job"}" have been completed to satisfaction. The customer will be notified to review and release escrow.`,
          placeholder: "e.g., Work finished, all test runs completed successfully...",
          confirmText: "Mark Completed",
          confirmIcon: "fas fa-check-double",
          variant: "success"
        };
      default:
        return {
          title: "Update Booking Status",
          description: `Update status for booking ${booking.bookingNumber}.`,
          placeholder: "Optional notes...",
          confirmText: "Update Status",
          confirmIcon: "fas fa-check",
          variant: "primary"
        };
    }
  };

  const config = getStatusConfig();

  const handleConfirm = () => {
    onConfirm(
      booking,
      targetStatus,
      notes.trim() || undefined,
      targetStatus === "PAYMENT_PENDING" ? confirmedAmount : undefined
    );
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
          <div className={`bkstatus-icon-box ${config.variant}`}>
            <i className={config.confirmIcon}></i>
          </div>
          <h3 className="bkstatus-title">{config.title}</h3>
          <p className="bkstatus-desc">{config.description}</p>
        </div>

        <div className="bkstatus-modal-body">
          {targetStatus === "PAYMENT_PENDING" && (
            <div className="bkstatus-amount-section">
              <label className="bkstatus-label" htmlFor="status-total-amount">
                Confirmed Total Amount (₹)
              </label>
              <input
                id="status-total-amount"
                type="number"
                min="1"
                className="bkstatus-amount-input"
                value={confirmedAmount}
                onChange={(e) => setConfirmedAmount(Number(e.target.value))}
              />
              <span className="bkstatus-amount-helper">
                Current Quote Total: ₹{booking.totalAmount.toLocaleString("en-IN")}. You can adjust this amount if parts, materials, or on-site changes altered the final bill.
              </span>
            </div>
          )}

          <label className="bkstatus-label" htmlFor="status-notes">
            Optional Notes / Updates for Client
          </label>
          <textarea
            id="status-notes"
            className="bkstatus-textarea"
            rows={3}
            placeholder={config.placeholder}
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
            className={`bkstatus-btn-confirm ${config.variant}`}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <i className={config.confirmIcon}></i>
                <span>{config.confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
