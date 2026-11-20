import React, { useState } from "react";
import type { BookingItem, BookingStatus } from "../../types/booking.types";
import "./BookingStatusModal.css";

interface BookingStatusModalProps {
  booking: BookingItem | null;
  targetStatus: BookingStatus | null;
  isOpen: boolean;
  isLoading: boolean;
  role?: "CUSTOMER" | "PROVIDER";
  onClose: () => void;
  onConfirm: (booking: BookingItem, newStatus: BookingStatus, notes?: string, totalAmount?: number) => void;
}

export const BookingStatusModal: React.FC<BookingStatusModalProps> = ({
  booking,
  targetStatus,
  isOpen,
  isLoading,
  role,
  onClose,
  onConfirm
}) => {
  const [notes, setNotes] = useState("");
  const [confirmedAmount, setConfirmedAmount] = useState<number>(() => booking?.totalAmount || 0);
  const [cancellationStep, setCancellationStep] = useState<"WARNING" | "FORM">("WARNING");

  React.useEffect(() => {
    if (booking?.totalAmount) {
      setConfirmedAmount(booking.totalAmount);
    }
  }, [booking?.totalAmount, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      setCancellationStep("WARNING");
      setNotes("");
    }
  }, [isOpen, targetStatus]);

  if (!isOpen || !booking || !targetStatus) return null;

  const isFixed = booking.quotationType === "FIXED" || (!booking.quotationType && !booking.requiresInspection);
  const isInspection = booking.quotationType === "INSPECTION_REQUIRED" || booking.requiresInspection;

  const advancePaid = booking.advanceAmount || booking.totalAmount;
  const calculatedBalance = Math.max(0, confirmedAmount - advancePaid);
  const isInvalidAmount =
    targetStatus === "PAYMENT_PENDING" &&
    !isFixed &&
    (confirmedAmount < advancePaid || isNaN(confirmedAmount) || confirmedAmount <= 0);

  const isCancellation = targetStatus === "CANCELLED";
  const isProviderCancellation = isCancellation && role === "PROVIDER";
  const cancellationsUsed = booking.providerCancellationsCount ?? 0;
  const isUntouchable = isProviderCancellation;

  const isInvalidReason = isCancellation && (!notes || !notes.trim());

  const cancellationReasons = role === "CUSTOMER" ? [
    "Change of plans / Service no longer needed",
    "Personal / Medical emergency",
    "Found an alternative solution",
    "Booked incorrect service or date by mistake",
    "Provider requested cancellation",
    "Other personal reason"
  ] : [
    "Vehicle breakdown / Transportation issue",
    "Personal / Medical emergency",
    "Schedule conflict / Unexpected delay",
    "Location unreachable / Safety concern",
    "Customer requested cancellation",
    "Other operational reason"
  ];

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
      case "CANCELLED":
        return {
          title: "Cancel Booking (Pre-Dispatch)?",
          description: role === "CUSTOMER"
            ? `Are you sure you want to cancel this booking before the provider travels? You will receive a 100% full refund of ₹${advancePaid.toLocaleString("en-IN")} secured in Escrow back to your account.`
            : `Are you sure you want to cancel this booking before travelling? The customer will receive a 100% full refund of the payment secured in Escrow.`,
          placeholder: "Select a reason above or write specific details...",
          confirmText: role === "CUSTOMER" ? "Yes, Cancel Booking & Receive Refund" : "Yes, Cancel & Refund Customer",
          confirmIcon: "fas fa-times-circle",
          variant: "danger"
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

  const handleOverlayClick = () => {
    if (isUntouchable) {
      return;
    }
    onClose();
  };

  const handleConfirm = () => {
    if (isInvalidAmount) return;
    onConfirm(
      booking,
      targetStatus,
      notes.trim() || undefined,
      targetStatus === "PAYMENT_PENDING" && !isFixed ? confirmedAmount : undefined
    );
  };

  if (isProviderCancellation && cancellationStep === "WARNING") {
    return (
      <div className="bkstatus-modal-overlay untouchable" onClick={handleOverlayClick}>
        <div
          className="bkstatus-modal-dialog"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          {cancellationsUsed === 0 && (
            <>
              <div className="bkstatus-modal-header">
                <div className="bkstatus-icon-box warning">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <h3 className="bkstatus-title">Cancellation Warning (1 of 2)</h3>
                <div className="bkstatus-strike-pill warning">
                  <i className="fas fa-info-circle"></i>
                  <span>Cancellation Strike 1 of 2</span>
                </div>
              </div>

              <div className="bkstatus-modal-body">
                <div className="bkstatus-warning-box">
                  <p className="bkstatus-warning-para">
                    As a service provider on this platform, you are allowed a maximum of 2 cancellations across all your confirmed bookings.
                  </p>
                  <p className="bkstatus-warning-para">
                    Proceeding with this cancellation will be recorded as your <strong>1st cancellation</strong>. You will have only <strong>1 cancellation remaining</strong> before reaching your final limit. If you reach your limit, you will no longer be allowed to cancel any bookings.
                  </p>
                  <p className="bkstatus-warning-sub">
                    Repeated cancellations affect customer experience and platform reliability.
                  </p>
                </div>
              </div>

              <div className="bkstatus-modal-footer">
                <button
                  type="button"
                  className="bkstatus-btn-cancel"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  className="bkstatus-btn-confirm warning"
                  onClick={() => setCancellationStep("FORM")}
                  disabled={isLoading}
                >
                  <span>Continue</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </>
          )}

          {cancellationsUsed === 1 && (
            <>
              <div className="bkstatus-modal-header">
                <div className="bkstatus-icon-box danger">
                  <i className="fas fa-exclamation-circle"></i>
                </div>
                <h3 className="bkstatus-title">Final Cancellation Warning (2 of 2)</h3>
                <div className="bkstatus-strike-pill danger">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>Final Permitted Cancellation</span>
                </div>
              </div>

              <div className="bkstatus-modal-body">
                <div className="bkstatus-warning-box danger">
                  <p className="bkstatus-warning-para">
                    You have already used <strong>1 of your 2 permitted cancellations</strong>.
                  </p>
                  <p className="bkstatus-warning-para">
                    If you proceed, this will be your <strong>2nd and final cancellation</strong>. Once completed, your cancellation limit will be completely exhausted. You will <strong>NOT</strong> be allowed to cancel any further bookings in the future.
                  </p>
                  <p className="bkstatus-warning-sub">
                    Please consider keeping this booking if possible to maintain good standing on the platform.
                  </p>
                </div>
              </div>

              <div className="bkstatus-modal-footer">
                <button
                  type="button"
                  className="bkstatus-btn-cancel"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  className="bkstatus-btn-confirm danger"
                  onClick={() => setCancellationStep("FORM")}
                  disabled={isLoading}
                >
                  <span>Continue</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </>
          )}

          {cancellationsUsed >= 2 && (
            <>
              <div className="bkstatus-modal-header">
                <div className="bkstatus-icon-box danger">
                  <i className="fas fa-ban"></i>
                </div>
                <h3 className="bkstatus-title">Cancellation Not Allowed</h3>
                <div className="bkstatus-strike-pill locked">
                  <i className="fas fa-lock"></i>
                  <span>Limit Reached (2 / 2 Used)</span>
                </div>
              </div>

              <div className="bkstatus-modal-body">
                <div className="bkstatus-warning-box locked">
                  <p className="bkstatus-warning-para">
                    You have already reached the maximum limit of 2 cancellations permitted for service providers.
                  </p>
                  <p className="bkstatus-warning-para">
                    You cannot cancel this booking. Further cancellations are disabled for your account. You must proceed to fulfill the service as scheduled.
                  </p>
                </div>
              </div>

              <div className="bkstatus-modal-footer">
                <button
                  type="button"
                  className="bkstatus-btn-confirm primary full-width"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  <i className="fas fa-arrow-left"></i>
                  <span>Go Back to Booking</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bkstatus-modal-overlay ${isUntouchable ? "untouchable" : ""}`} onClick={handleOverlayClick}>
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
                  <i className="fas fa-lock"></i>
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
                    <i className={isInspection ? "fas fa-clipboard-check" : "fas fa-calculator"}></i>
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

          {isCancellation && (
            <div className="bkstatus-cancel-notice">
              <i className="fas fa-shield-alt"></i>
              <div>
                <strong>Automatic 100% Refund:</strong>
                <span>
                  The full payment of ₹{advancePaid.toLocaleString("en-IN")} held in Escrow will be released back to the customer.
                </span>
              </div>
            </div>
          )}

          {isCancellation && (
            <div className="bkstatus-reason-chips-wrap">
              <span className="bkstatus-label">Select Cancellation Reason:</span>
              <div className="bkstatus-reason-chips">
                {cancellationReasons.map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`bkstatus-chip ${notes === r ? "active" : ""}`}
                    onClick={() => setNotes(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <label className="bkstatus-label" htmlFor="status-notes">
            {isCancellation ? "Cancellation Reason (Required)" : "Optional Notes / Updates for Client"}
          </label>
          <textarea
            id="status-notes"
            className={`bkstatus-textarea ${isInvalidReason ? "error" : ""}`}
            rows={3}
            placeholder={config.placeholder}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="bkstatus-modal-footer">
          {isProviderCancellation ? (
            <button
              type="button"
              className="bkstatus-btn-cancel"
              onClick={() => setCancellationStep("WARNING")}
              disabled={isLoading}
            >
              <i className="fas fa-arrow-left"></i>
              <span>Back</span>
            </button>
          ) : (
            <button
              type="button"
              className="bkstatus-btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            className={`bkstatus-btn-confirm ${config.variant}`}
            onClick={handleConfirm}
            disabled={isLoading || isInvalidAmount || isInvalidReason}
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
