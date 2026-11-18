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

  const isFixed = booking.quotationType === "FIXED" || (!booking.quotationType && !booking.requiresInspection);
  const isInspection = booking.quotationType === "INSPECTION_REQUIRED" || booking.requiresInspection;

  const advancePaid = booking.advanceAmount || Math.round(booking.totalAmount * 0.3);
  const calculatedBalance = Math.max(0, confirmedAmount - advancePaid);
  const isInvalidAmount =
    targetStatus === "PAYMENT_PENDING" &&
    !isFixed &&
    (confirmedAmount < advancePaid || isNaN(confirmedAmount) || confirmedAmount <= 0);

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
        if (isFixed) {
          return {
            title: "Request Final Payment Settlement?",
            description: `Work is complete for "${booking.serviceRequestTitle || "this job"}". Under this Fixed Price agreement of ₹${booking.totalAmount.toLocaleString("en-IN")}, request the customer to settle the remaining balance of ₹${(booking.totalAmount - advancePaid).toLocaleString("en-IN")}.`,
            placeholder: "e.g., Job executed completely as agreed. Ready for settlement...",
            confirmText: `Request Settlement (₹${(booking.totalAmount - advancePaid).toLocaleString("en-IN")})`,
            confirmIcon: "fas fa-file-invoice-dollar",
            variant: "warning"
          };
        }
        return {
          title: isInspection ? "Confirm Inspection-Based Final Total?" : "Confirm Estimated Final Total?",
          description: `Confirm the final total amount for "${booking.serviceRequestTitle || "this job"}". The customer will be requested to pay the balance after deducting the advance paid.`,
          placeholder: "e.g., Completed all work including extra parts. Final amount confirmed...",
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
    if (isInvalidAmount) return;
    onConfirm(
      booking,
      targetStatus,
      notes.trim() || undefined,
      targetStatus === "PAYMENT_PENDING" && !isFixed ? confirmedAmount : undefined
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
            isFixed ? (
              <div className="bkstatus-fixed-quote-box">
                <div className="bkstatus-fq-badge">
                  <i className="fas fa-lock" />
                  <span>Fixed Price Agreement</span>
                </div>
                <div className="bkstatus-fq-row">
                  <span>Agreed Fixed Total</span>
                  <strong>₹{booking.totalAmount.toLocaleString("en-IN")}</strong>
                </div>
                <div className="bkstatus-fq-row advance">
                  <span>(-) Advance Already Paid</span>
                  <span>-₹{advancePaid.toLocaleString("en-IN")}</span>
                </div>
                <div className="bkstatus-fq-row balance">
                  <span>(=) Balance Customer Must Settle</span>
                  <strong>₹{(booking.totalAmount - advancePaid).toLocaleString("en-IN")}</strong>
                </div>
                <span className="bkstatus-fq-note">
                  This booking was accepted under a fixed price quotation. The total price is agreed and locked.
                </span>
              </div>
            ) : (
              <div className="bkstatus-amount-section">
                <div className="bkstatus-dynamic-header">
                  <span className="bkstatus-dyn-badge">
                    <i className={isInspection ? "fas fa-clipboard-check" : "fas fa-calculator"} />
                    {isInspection ? "Inspection-Based Final Amount" : "Estimated Quote — Final Amount"}
                  </span>
                </div>
                <label className="bkstatus-label" htmlFor="status-total-amount">
                  Final Confirmed Total Amount (₹)
                </label>
                <input
                  id="status-total-amount"
                  type="number"
                  min={advancePaid}
                  className={`bkstatus-amount-input ${isInvalidAmount ? "error" : ""}`}
                  value={confirmedAmount}
                  onChange={(e) => setConfirmedAmount(Number(e.target.value))}
                />
                <div className="bkstatus-amount-calc-preview">
                  <div className="bkstatus-calc-item">
                    <span>Advance Paid Online:</span>
                    <strong>₹{advancePaid.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="bkstatus-calc-item balance">
                    <span>Remaining Due:</span>
                    <strong>₹{calculatedBalance.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
                {isInvalidAmount ? (
                  <span className="bkstatus-amount-error">
                    Total amount cannot be less than the advance deposit already collected (₹{advancePaid.toLocaleString("en-IN")}).
                  </span>
                ) : (
                  <span className="bkstatus-amount-helper">
                    Initial Quote: ₹{booking.totalAmount.toLocaleString("en-IN")}. Adjust the total if extra labor, parts, or diagnostic findings changed the final cost.
                  </span>
                )}
              </div>
            )
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
            disabled={isLoading || isInvalidAmount}
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
