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
  const initialAdvancePaid = booking ? (booking.advanceAmount || booking.totalAmount) : 0;
  const initialRemaining = booking ? Math.max(0, (booking.totalAmount || 0) - initialAdvancePaid) : 0;
  const [remainingAmount, setRemainingAmount] = useState<number>(() => initialRemaining);
  const [cancellationStep, setCancellationStep] = useState<"WARNING" | "FORM">("WARNING");

  React.useEffect(() => {
    if (booking?.totalAmount !== undefined) {
      const adv = booking.advanceAmount || booking.totalAmount;
      setRemainingAmount(Math.max(0, booking.totalAmount - adv));
    }
  }, [booking?.totalAmount, booking?.advanceAmount, isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      setCancellationStep("WARNING");
      setNotes("");
    }
  }, [isOpen, targetStatus]);

  if (!isOpen || !booking || !targetStatus) return null;

  const isFixed = booking.quotationType === "FIXED" || (!booking.quotationType && !booking.requiresInspection);

  const advancePaid = booking.advanceAmount || booking.totalAmount;
  const isInvalidRemaining =
    targetStatus === "PAYMENT_PENDING" &&
    !isFixed &&
    (isNaN(remainingAmount) || remainingAmount < 0);

  const safeRemaining = isNaN(remainingAmount) || remainingAmount < 0 ? 0 : remainingAmount;
  const finalTotal = advancePaid + safeRemaining;
  const willCompleteDirectly = targetStatus === "PAYMENT_PENDING" && !isFixed && safeRemaining === 0;

  const isCancellation = targetStatus === "CANCELLED";
  const isProviderCancellation = isCancellation && role === "PROVIDER";
  const isCustomerCancellation = isCancellation && role === "CUSTOMER";
  const cancellationsUsed = booking.providerCancellationsCount ?? 0;
  const isUntouchable = isCancellation;

  const isInvalidReason = isCancellation && (!notes || !notes.trim());

  const policy = booking.cancellationPolicy;
  const refundableAmount = policy?.refundableAmount ?? advancePaid;
  const cancellationFee = policy?.cancellationFee ?? 0;

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
            title: "Request Final Payment Settlement",
            description: `Request customer to settle the remaining balance of ₹${(booking.totalAmount - advancePaid).toLocaleString("en-IN")}.`,
            placeholder: "Optional notes for customer...",
            confirmText: `Request ₹${(booking.totalAmount - advancePaid).toLocaleString("en-IN")} Settlement`,
            confirmIcon: "fas fa-file-invoice-dollar",
            variant: "warning"
          };
        }
        if (willCompleteDirectly) {
          return {
            title: "Complete Job",
            description: `The advance deposit covers the entire job. Confirm to complete.`,
            placeholder: "Optional notes for customer...",
            confirmText: "Complete Job",
            confirmIcon: "fas fa-check-circle",
            variant: "success"
          };
        }
        return {
          title: "Complete Job & Settle Balance",
          description: `Customer will be requested to pay the remaining balance online to finalize the booking.`,
          placeholder: "Optional notes or details for customer...",
          confirmText: `Request ₹${safeRemaining.toLocaleString("en-IN")} & Complete`,
          confirmIcon: "fas fa-file-invoice-dollar",
          variant: "primary"
        };
      case "COMPLETED":
        return {
          title: "Confirm Job Completion?",
          description: `Confirm that all deliverables for "${booking.serviceRequestTitle || "this job"}" have been completed to satisfaction. The customer will be notified to review and release escrow.`,
          placeholder: "e.g., Work finished, all test runs completed successfully...",
          confirmText: "Mark Completed",
          confirmIcon: "fas fa-check-circle",
          variant: "success"
        };
      case "CANCELLED":
        return {
          title: "Confirm Booking Cancellation",
          description: role === "CUSTOMER"
            ? `Please select your reason. ${refundableAmount > 0 ? `₹${refundableAmount.toLocaleString("en-IN")} will be refunded to your wallet.` : "Advance payment is non-refundable."}`
            : `Please provide a reason. The payment secured in Escrow will be released to the customer.`,
          placeholder: "Select a reason above or write specific details...",
          confirmText: role === "CUSTOMER"
            ? (refundableAmount > 0 ? `Yes, Cancel Booking & Receive ₹${refundableAmount.toLocaleString("en-IN")} Refund` : "Yes, Cancel Booking")
            : "Yes, Cancel & Refund Customer",
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
    if (isInvalidRemaining) return;
    const effectiveStatus = willCompleteDirectly ? "COMPLETED" : targetStatus;
    const effectiveAmount = targetStatus === "PAYMENT_PENDING" && !isFixed ? finalTotal : undefined;
    onConfirm(
      booking,
      effectiveStatus,
      notes.trim() || undefined,
      effectiveAmount
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

  if (isCustomerCancellation && cancellationStep === "WARNING") {
    const isEnRoute = booking.status === "EN_ROUTE";
    const isLimit = policy?.policyStatus === "LIMIT_EXCEEDED";
    const isFinalFree = policy?.policyStatus === "FINAL_FREE_CANCELLATION";

    return (
      <div className="bkstatus-modal-overlay untouchable" onClick={handleOverlayClick}>
        <div
          className="bkstatus-modal-dialog"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="bkstatus-modal-header">
            <div className={`bkstatus-icon-box ${isEnRoute || isLimit ? "danger" : "warning"}`}>
              <i className={isEnRoute ? "fas fa-route" : isLimit ? "fas fa-exclamation-circle" : "fas fa-info-circle"}></i>
            </div>
            <h3 className="bkstatus-title">
              {isEnRoute
                ? "Technician Is On The Way"
                : isLimit
                  ? "Cancellation Fee Notice"
                  : isFinalFree
                    ? "Final Free Cancellation (2 of 2)"
                    : "Cancellation Policy (1 of 2)"}
            </h3>
            <div className={`bkstatus-strike-pill ${isEnRoute || isLimit ? "danger" : isFinalFree ? "warning" : "warning"}`}>
              <i className={isEnRoute ? "fas fa-car" : isLimit ? "fas fa-exclamation-triangle" : "fas fa-shield-alt"}></i>
              <span>
                {isEnRoute
                  ? "En Route Travel Policy"
                  : isLimit
                    ? "Limit Exceeded (Fee Applied)"
                    : isFinalFree
                      ? "Final Free Cancellation"
                      : "Free Cancellation (Strike 1 of 2)"}
              </span>
            </div>
          </div>

          <div className="bkstatus-modal-body">
            <div className={`bkstatus-warning-box ${isEnRoute || isLimit ? "danger" : ""}`}>
              <p className="bkstatus-warning-para">
                {policy?.policyMessage || (
                  isEnRoute
                    ? "The technician is already travelling to your location. A cancellation deduction applies to compensate travel time."
                    : "You are allowed 2 free cancellations across your confirmed bookings. Please review the refund breakdown below."
                )}
              </p>
            </div>

            <div className="bkstatus-refund-breakdown">
              <div className="bkstatus-rf-row">
                <span>Advance Paid in Escrow</span>
                <strong>₹{advancePaid.toLocaleString("en-IN")}</strong>
              </div>
              {cancellationFee > 0 && (
                <div className="bkstatus-rf-row fee">
                  <span>(-) Travel / Cancellation Fee</span>
                  <strong className="text-danger">-₹{cancellationFee.toLocaleString("en-IN")}</strong>
                </div>
              )}
              <div className="bkstatus-rf-row refund">
                <span>(=) Refund to Your Wallet</span>
                <strong className="text-success">₹{refundableAmount.toLocaleString("en-IN")}</strong>
              </div>
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
              className={`bkstatus-btn-confirm ${isEnRoute || isLimit ? "danger" : "warning"}`}
              onClick={() => setCancellationStep("FORM")}
              disabled={isLoading}
            >
              <span>Continue to Cancel</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
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
              <div className="bksettle-card">
                <div className="bksettle-row">
                  <span className="bksettle-label">Advance Paid Online</span>
                  <span className="bksettle-paid-badge">
                    <i className="fas fa-check-circle"></i>
                    ₹{advancePaid.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className={`bksettle-input-group ${isInvalidRemaining ? "error" : ""}`}>
                  <div className="bksettle-input-meta">
                    <label htmlFor="status-remaining-amount">Additional Amount to Collect</label>
                    <span>Extra parts, diagnostics, or additional labor</span>
                  </div>
                  <div className="bksettle-input-box">
                    <span className="bksettle-currency">₹</span>
                    <input
                      id="status-remaining-amount"
                      type="number"
                      min={0}
                      step={1}
                      placeholder="0"
                      className="bksettle-amount-input"
                      value={remainingAmount === 0 ? "" : remainingAmount}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                          setRemainingAmount(0);
                        } else {
                          const num = Number(raw);
                          setRemainingAmount(isNaN(num) ? 0 : Math.max(0, num));
                        }
                      }}
                    />
                  </div>
                </div>

                <label className="bksettle-checkbox">
                  <input
                    type="checkbox"
                    checked={safeRemaining === 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRemainingAmount(0);
                      }
                    }}
                  />
                  <span>No additional charges (advance deposit covers the full service)</span>
                </label>

                <div className="bksettle-divider"></div>

                <div className="bksettle-summary">
                  <div className="bksettle-summary-row">
                    <span>Total Service Cost</span>
                    <strong>₹{finalTotal.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="bksettle-summary-row due">
                    <span>Remaining Balance Due</span>
                    <strong className={safeRemaining > 0 ? "has-balance" : "no-balance"}>
                      {safeRemaining > 0 ? `₹${safeRemaining.toLocaleString("en-IN")}` : "₹0 (Fully Paid)"}
                    </strong>
                  </div>
                </div>
              </div>
            )
          )}

          {isCancellation && (
            <div className="bkstatus-cancel-notice">
              <i className="fas fa-shield-alt"></i>
              <div>
                <strong>Refund Summary:</strong>
                <span>
                  {refundableAmount > 0
                    ? `₹${refundableAmount.toLocaleString("en-IN")} will be released back to your wallet.`
                    : "No refund available for this cancellation."}
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
            {isCancellation ? "Cancellation Reason (Required)" : "Optional Notes for Customer"}
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
          {isCancellation ? (
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
            disabled={isLoading || isInvalidRemaining || isInvalidReason}
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
