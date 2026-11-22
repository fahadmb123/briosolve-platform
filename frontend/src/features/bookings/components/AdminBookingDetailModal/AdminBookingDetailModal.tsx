import React, { useMemo, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Modal } from "../../../../shared/components/ui/Modal";
import type { AdminBookingItem, BookingStatus } from "../../types/booking.types";
import { useAdminUpdateBookingStatus } from "../../hooks/useAdminBookings";
import "./AdminBookingDetailModal.css";

interface AdminBookingDetailModalProps {
  booking: AdminBookingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdated?: (updated: AdminBookingItem) => void;
}

export const AdminBookingDetailModal: React.FC<AdminBookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose,
  onBookingUpdated
}) => {
  const [currentBooking, setCurrentBooking] = useState<AdminBookingItem | null>(booking);
  const [overrideStatus, setOverrideStatus] = useState<BookingStatus>("CONFIRMED");
  const [overrideReason, setOverrideReason] = useState("");
  const [activeConfirmAction, setActiveConfirmAction] = useState<null | "CANCEL" | "RELEASE">(null);
  const [actionReason, setActionReason] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const updateStatusMutation = useAdminUpdateBookingStatus();

  useEffect(() => {
    setCurrentBooking(booking);
    if (booking) {
      setOverrideStatus(booking.status);
      setOverrideReason("");
      setActiveConfirmAction(null);
      setActionReason("");
      setCopiedKey(null);
    }
  }, [booking]);

  const timelineItems = useMemo(() => {
    if (!currentBooking) return [];
    if (currentBooking.statusHistory && currentBooking.statusHistory.length > 0) {
      return currentBooking.statusHistory;
    }
    if (currentBooking.notes && currentBooking.notes.trim()) {
      try {
        const parsed = JSON.parse(currentBooking.notes);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return [
          {
            status: currentBooking.status,
            note: currentBooking.notes,
            timestamp: currentBooking.updatedAt,
            authorName: currentBooking.providerBusinessName || currentBooking.providerName || "Service Provider"
          }
        ];
      }
    }
    return [];
  }, [currentBooking]);

  if (!currentBooking) return null;

  const isTerminalState =
    currentBooking.status === "COMPLETED" ||
    currentBooking.status === "CANCELLED" ||
    currentBooking.status === "CLOSED";

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2000);
  };

  const handleExecuteStatusUpdate = async (newStatus: BookingStatus, reasonText: string) => {
    try {
      const updated = await updateStatusMutation.mutateAsync({
        id: currentBooking.id,
        payload: {
          status: newStatus,
          reason: reasonText.trim() || undefined
        }
      });
      const updatedItem: AdminBookingItem = {
        ...currentBooking,
        ...updated,
        status: newStatus,
        paymentStatus: newStatus === "CANCELLED" ? "REFUNDED" : newStatus === "COMPLETED" ? "PAID" : currentBooking.paymentStatus
      };
      setCurrentBooking(updatedItem);
      setActiveConfirmAction(null);
      setActionReason("");
      setOverrideStatus(newStatus);
      setOverrideReason("");
      toast.success(`Booking #${currentBooking.bookingNumber} marked as ${newStatus.replace("_", " ")}`);
      if (onBookingUpdated) {
        onBookingUpdated(updatedItem);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update booking status");
    }
  };

  const handleStatusOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isTerminalState && currentBooking.status !== "COMPLETED") {
      toast.error("Status modifications are locked for finalized bookings");
      return;
    }
    if (currentBooking.status === "COMPLETED" && overrideStatus !== "CLOSED") {
      toast.error("Completed bookings can only be archived to CLOSED status");
      return;
    }
    if (overrideStatus === currentBooking.status) {
      toast.error("Please choose a different status to override");
      return;
    }
    handleExecuteStatusUpdate(
      overrideStatus,
      overrideReason.trim() || `Admin manual override to ${overrideStatus}`
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "CLOSED":
        return <span className="badge badge-verified">{status.replace("_", " ")}</span>;
      case "IN_PROGRESS":
      case "EN_ROUTE":
      case "INSPECTION":
        return <span className="badge badge-pending">{status.replace("_", " ")}</span>;
      case "CANCELLED":
        return <span className="badge badge-danger-alert">{status}</span>;
      default:
        return <span className="badge badge-admin">{status.replace("_", " ")}</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="badge badge-verified">PAID</span>;
      case "ADVANCE_PAID":
        return <span className="badge badge-pending">ADVANCE PAID</span>;
      case "REFUNDED":
        return <span className="badge badge-danger-alert">REFUNDED</span>;
      default:
        return <span className="badge badge-admin">{status}</span>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Booking Inspection & Management"
      maxWidth="820px"
      footer={
        <button type="button" className="btn btn-secondary text-xs" onClick={onClose}>
          Close
        </button>
      }
    >
      <div className="admin-bk-modal-content">
        <div className="admin-bk-header-banner">
          <div className="admin-bk-ref-group">
            <i className="fas fa-receipt text-primary text-lg"></i>
            <div>
              <div className="admin-bk-ref-number">#{currentBooking.bookingNumber}</div>
              <div className="text-xs text-secondary mt-0.5">
                Created on{" "}
                {new Date(currentBooking.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>
            </div>
          </div>
          <div className="admin-bk-badges">
            {getStatusBadge(currentBooking.status)}
            {getPaymentStatusBadge(currentBooking.paymentStatus)}
          </div>
        </div>

        <div className="admin-bk-grid-two">
          <div className="admin-bk-card">
            <div className="admin-bk-card-title">
              <i className="fas fa-user text-primary"></i>
              <span>Customer Information</span>
            </div>
            <div className="admin-bk-info-list">
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Name</span>
                <span className="admin-bk-info-value">{currentBooking.customerName || "Customer"}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Email</span>
                <span className="admin-bk-info-value">{currentBooking.customerEmail || "N/A"}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Phone</span>
                <span className="admin-bk-info-value">{currentBooking.customerPhone || "N/A"}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Address</span>
                <span className="admin-bk-info-value">{currentBooking.addressText || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="admin-bk-card">
            <div className="admin-bk-card-title">
              <i className="fas fa-briefcase text-primary"></i>
              <span>Provider Information</span>
            </div>
            <div className="admin-bk-info-list">
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Business Name</span>
                <span className="admin-bk-info-value">
                  {currentBooking.providerBusinessName || currentBooking.providerName || "Assigned Provider"}
                </span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Representative</span>
                <span className="admin-bk-info-value">{currentBooking.providerName || "N/A"}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Email</span>
                <span className="admin-bk-info-value">{currentBooking.providerEmail || "N/A"}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Phone</span>
                <span className="admin-bk-info-value">{currentBooking.providerPhone || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-bk-card">
          <div className="admin-bk-card-title">
            <i className="fas fa-tools text-primary"></i>
            <span>Service & Schedule</span>
          </div>
          <div className="admin-bk-info-list">
            <div className="admin-bk-info-row">
              <span className="admin-bk-info-label">Requirement Title</span>
              <span className="admin-bk-info-value">
                {currentBooking.serviceRequestTitle || "Service Requirement"}
              </span>
            </div>
            <div className="admin-bk-info-row">
              <span className="admin-bk-info-label">Category</span>
              <span className="admin-bk-info-value">{currentBooking.categoryName || "General Service"}</span>
            </div>
            <div className="admin-bk-info-row">
              <span className="admin-bk-info-label">Scheduled Date</span>
              <span className="admin-bk-info-value">
                {currentBooking.scheduledDate
                  ? new Date(currentBooking.scheduledDate).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                  : "Flexible"}
              </span>
            </div>
            <div className="admin-bk-info-row">
              <span className="admin-bk-info-label">Scheduled Time Slot</span>
              <span className="admin-bk-info-value">{currentBooking.scheduledTime || "Flexible"}</span>
            </div>
          </div>
        </div>

        <div className="admin-bk-card">
          <div className="admin-bk-card-title">
            <i className="fas fa-coins text-primary"></i>
            <span>Financials & Escrow Breakdown</span>
          </div>
          <div className="admin-bk-financial-grid">
            <div className="admin-bk-fin-box">
              <div className="admin-bk-fin-lbl">Agreed Total</div>
              <div className="admin-bk-fin-val text-primary">₹{Number(currentBooking.totalAmount).toLocaleString("en-IN")}</div>
            </div>
            <div className="admin-bk-fin-box">
              <div className="admin-bk-fin-lbl">Advance Paid</div>
              <div className="admin-bk-fin-val text-success">₹{Number(currentBooking.advanceAmount || 0).toLocaleString("en-IN")}</div>
            </div>
            <div className="admin-bk-fin-box">
              <div className="admin-bk-fin-lbl">Remaining Balance</div>
              <div className="admin-bk-fin-val">₹{Number(currentBooking.remainingAmount || (Number(currentBooking.totalAmount) - Number(currentBooking.advanceAmount || 0))).toLocaleString("en-IN")}</div>
            </div>
            <div className="admin-bk-fin-box">
              <div className="admin-bk-fin-lbl">Platform Commission</div>
              <div className="admin-bk-fin-val">₹{Number(currentBooking.platformFee).toLocaleString("en-IN")}</div>
            </div>
          </div>

          {(currentBooking.orderId || currentBooking.paymentId) && (
            <div className="admin-bk-tx-container">
              {currentBooking.orderId && (
                <div className="admin-bk-tx-row">
                  <span className="admin-bk-tx-lbl">
                    <i className="fas fa-receipt text-primary"></i>
                    <span>Order ID</span>
                  </span>
                  <div className="admin-bk-tx-code-wrap">
                    <code className="admin-bk-tx-code">{currentBooking.orderId}</code>
                    <button
                      type="button"
                      className="admin-bk-tx-copy"
                      title="Copy Order ID"
                      onClick={() => handleCopy(currentBooking.orderId!, "orderId")}
                    >
                      <i className={`fas ${copiedKey === "orderId" ? "fa-check text-success" : "fa-copy"}`}></i>
                    </button>
                  </div>
                </div>
              )}
              {currentBooking.paymentId && (
                <div className="admin-bk-tx-row">
                  <span className="admin-bk-tx-lbl">
                    <i className="fas fa-credit-card text-success"></i>
                    <span>Payment Transaction ID</span>
                  </span>
                  <div className="admin-bk-tx-code-wrap">
                    <code className="admin-bk-tx-code">{currentBooking.paymentId}</code>
                    <button
                      type="button"
                      className="admin-bk-tx-copy"
                      title="Copy Payment ID"
                      onClick={() => handleCopy(currentBooking.paymentId!, "paymentId")}
                    >
                      <i className={`fas ${copiedKey === "paymentId" ? "fa-check text-success" : "fa-copy"}`}></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="admin-bk-card admin-bk-actions-card">
          <div className="admin-bk-card-title">
            <i className="fas fa-shield-alt text-primary"></i>
            <span style={{ color: "var(--text, #ffffff)" }}>Administrative Operations & Escrow Controls</span>
          </div>
          <p className="admin-bk-actions-desc">
            Direct intervention controls for customer refunds, provider escrow releases, and status overrides.
          </p>

          <div className="admin-bk-quick-actions">
            {!isTerminalState && (
              <>
                <button
                  type="button"
                  className="admin-bk-btn-cancel"
                  onClick={() => {
                    setActiveConfirmAction(activeConfirmAction === "CANCEL" ? null : "CANCEL");
                    setActionReason("Forced cancellation and wallet refund initiated by administrator.");
                  }}
                >
                  <i className="fas fa-ban"></i>
                  <span>Force Cancel & Refund</span>
                </button>

                <button
                  type="button"
                  className="admin-bk-btn-release"
                  onClick={() => {
                    setActiveConfirmAction(activeConfirmAction === "RELEASE" ? null : "RELEASE");
                    setActionReason("Escrow funds released to provider by administrator.");
                  }}
                >
                  <i className="fas fa-hand-holding-usd"></i>
                  <span>Release Escrow to Provider</span>
                </button>
              </>
            )}

            <a
              href={`/admin/support?search=${encodeURIComponent(currentBooking.bookingNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-bk-btn-support"
            >
              <i className="fas fa-life-ring"></i>
              <span>Dispute & Support Desk</span>
              <i className="fas fa-external-link-alt text-xs" style={{ opacity: 0.6 }}></i>
            </a>
          </div>

          {activeConfirmAction === "CANCEL" && (
            <div className="admin-bk-confirm-box admin-bk-confirm-danger">
              <div className="admin-bk-confirm-header">
                <i className="fas fa-exclamation-triangle"></i>
                <span>Confirm Force Cancellation & Wallet Refund</span>
              </div>
              <p className="admin-bk-confirm-text">
                This action will mark booking <strong>#{currentBooking.bookingNumber}</strong> as CANCELLED and credit <strong>₹{Number(currentBooking.advanceAmount || currentBooking.totalAmount || 0).toLocaleString("en-IN")}</strong> back into the customer's wallet balance.
              </p>
              <div className="admin-bk-confirm-input-wrap">
                <input
                  type="text"
                  className="admin-input text-xs"
                  placeholder="Reason for cancellation (logged in audit trail)..."
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                />
              </div>
              <div className="admin-bk-confirm-btns">
                <button
                  type="button"
                  className="btn btn-danger text-xs"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => handleExecuteStatusUpdate("CANCELLED", actionReason)}
                >
                  {updateStatusMutation.isPending ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className="fas fa-check mr-1"></i>}
                  Execute Refund & Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-secondary text-xs"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => setActiveConfirmAction(null)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {activeConfirmAction === "RELEASE" && (
            <div className="admin-bk-confirm-box admin-bk-confirm-success">
              <div className="admin-bk-confirm-header">
                <i className="fas fa-check-circle"></i>
                <span>Confirm Escrow Release to Provider</span>
              </div>
              <p className="admin-bk-confirm-text">
                This action will mark booking <strong>#{currentBooking.bookingNumber}</strong> as COMPLETED, deduct the platform fee (<strong>₹{Number(currentBooking.platformFee).toLocaleString("en-IN")}</strong>), and credit net earnings to the provider's wallet balance.
              </p>
              <div className="admin-bk-confirm-input-wrap">
                <input
                  type="text"
                  className="admin-input text-xs"
                  placeholder="Reason for escrow release (optional)..."
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                />
              </div>
              <div className="admin-bk-confirm-btns">
                <button
                  type="button"
                  className="btn btn-success text-xs"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => handleExecuteStatusUpdate("COMPLETED", actionReason)}
                >
                  {updateStatusMutation.isPending ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className="fas fa-check mr-1"></i>}
                  Release Escrow Funds
                </button>
                <button
                  type="button"
                  className="btn btn-secondary text-xs"
                  disabled={updateStatusMutation.isPending}
                  onClick={() => setActiveConfirmAction(null)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <div className="admin-bk-override-box">
            <div className="admin-bk-override-title">
              <i className="fas fa-sliders-h text-primary"></i>
              <span>Manual Status Override & Audit Trail</span>
            </div>

            {currentBooking.status === "COMPLETED" ? (
              <div className="admin-bk-locked-notice admin-bk-locked-completed">
                <i className="fas fa-lock"></i>
                <div>
                  <strong>Booking Finalized & Escrow Disbursed</strong>
                  <p>This booking has been completed and provider earnings have been disbursed. Status changes and cancellations are locked to protect financial consistency.</p>
                </div>
              </div>
            ) : currentBooking.status === "CANCELLED" ? (
              <div className="admin-bk-locked-notice admin-bk-locked-cancelled">
                <i className="fas fa-lock"></i>
                <div>
                  <strong>Booking Cancelled & Refunded</strong>
                  <p>This booking has been cancelled and customer funds have been refunded. No further status changes are permitted.</p>
                </div>
              </div>
            ) : currentBooking.status === "CLOSED" ? (
              <div className="admin-bk-locked-notice admin-bk-locked-closed">
                <i className="fas fa-archive"></i>
                <div>
                  <strong>Booking Archived & Closed</strong>
                  <p>This booking is closed and archived permanently.</p>
                </div>
              </div>
            ) : (
              <form className="admin-bk-override-form" onSubmit={handleStatusOverrideSubmit}>
                <div className="admin-bk-override-row">
                  <select
                    className="admin-select text-xs"
                    value={overrideStatus}
                    onChange={(e) => setOverrideStatus(e.target.value as BookingStatus)}
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="EN_ROUTE">EN ROUTE</option>
                    <option value="INSPECTION">INSPECTION</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="PAYMENT_PENDING">PAYMENT PENDING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <input
                    type="text"
                    className="admin-input text-xs"
                    placeholder="State audit reason for status override..."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                  />

                  <button
                    type="submit"
                    className="btn btn-primary text-xs"
                    disabled={updateStatusMutation.isPending || overrideStatus === currentBooking.status}
                  >
                    {updateStatusMutation.isPending ? <i className="fas fa-spinner fa-spin mr-1"></i> : <i className="fas fa-save mr-1"></i>}
                    Apply Override
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {currentBooking.mismatchReport && (
          <div className="admin-bk-card" style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
            <div className="admin-bk-card-title" style={{ color: "#ef4444" }}>
              <i className="fas fa-exclamation-triangle"></i>
              <span>Scope Mismatch Report</span>
            </div>
            <div className="admin-bk-info-list">
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Report Status</span>
                <span className="admin-bk-info-value">
                  <span className="badge badge-danger-alert">{currentBooking.mismatchReport.status}</span>
                </span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Provider Diagnosis</span>
                <span className="admin-bk-info-value">{currentBooking.mismatchReport.diagnosis}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Inspection Visit Fee</span>
                <span className="admin-bk-info-value">₹{currentBooking.mismatchReport.visitFee}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Refund Amount</span>
                <span className="admin-bk-info-value">₹{currentBooking.mismatchReport.refundAmount}</span>
              </div>
            </div>
          </div>
        )}

        {timelineItems.length > 0 && (
          <div className="admin-bk-card">
            <div className="admin-bk-card-title">
              <i className="fas fa-history text-primary"></i>
              <span>Activity Timeline & Audit Trail</span>
            </div>
            <div className="admin-bk-timeline">
              {timelineItems.map((item, idx) => (
                <div key={idx} className="admin-bk-timeline-item">
                  <div className="admin-bk-timeline-dot"></div>
                  <div className="admin-bk-timeline-header">
                    <span className="admin-bk-timeline-status">{item.status.replace("_", " ")}</span>
                    <span className="admin-bk-timeline-time">
                      {new Date(item.timestamp).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  {item.authorName && (
                    <span className="text-xs text-secondary">Logged by: {item.authorName}</span>
                  )}
                  {item.note && <div className="admin-bk-timeline-note">{item.note}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
