import React, { useMemo } from "react";
import { Modal } from "../../../../shared/components/ui/Modal";
import type { AdminBookingItem } from "../../types/booking.types";
import "./AdminBookingDetailModal.css";

interface AdminBookingDetailModalProps {
  booking: AdminBookingItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminBookingDetailModal: React.FC<AdminBookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose
}) => {
  const timelineItems = useMemo(() => {
    if (!booking) return [];
    if (booking.statusHistory && booking.statusHistory.length > 0) {
      return booking.statusHistory;
    }
    if (booking.notes && booking.notes.trim()) {
      try {
        const parsed = JSON.parse(booking.notes);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        return [
          {
            status: booking.status,
            note: booking.notes,
            timestamp: booking.updatedAt,
            authorName: booking.providerBusinessName || booking.providerName || "Service Provider"
          }
        ];
      }
    }
    return [];
  }, [booking]);

  if (!booking) return null;

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
      title="Booking Inspection"
      maxWidth="780px"
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
              <div className="admin-bk-ref-number">#{booking.bookingNumber}</div>
              <div className="text-xs text-secondary mt-0.5">
                Created on{" "}
                {new Date(booking.createdAt).toLocaleDateString("en-IN", {
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
            {getStatusBadge(booking.status)}
            {getPaymentStatusBadge(booking.paymentStatus)}
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
                <span className="admin-bk-info-value">{booking.customerName || "Customer"}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Email</span>
                <span className="admin-bk-info-value">{booking.customerEmail || "N/A"}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Phone</span>
                <span className="admin-bk-info-value">{booking.customerPhone || "N/A"}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Address</span>
                <span className="admin-bk-info-value">{booking.addressText || "N/A"}</span>
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
                  {booking.providerBusinessName || booking.providerName || "Assigned Provider"}
                </span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Representative</span>
                <span className="admin-bk-info-value">{booking.providerName || "N/A"}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Email</span>
                <span className="admin-bk-info-value">{booking.providerEmail || "N/A"}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Phone</span>
                <span className="admin-bk-info-value">{booking.providerPhone || "N/A"}</span>
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
                {booking.serviceRequestTitle || "Service Requirement"}
              </span>
            </div>
            <div className="admin-bk-info-row">
              <span className="admin-bk-info-label">Category</span>
              <span className="admin-bk-info-value">{booking.categoryName || "General Service"}</span>
            </div>
            <div className="admin-bk-info-row">
              <span className="admin-bk-info-label">Scheduled Date</span>
              <span className="admin-bk-info-value">
                {booking.scheduledDate
                  ? new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
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
              <span className="admin-bk-info-value">{booking.scheduledTime || "Flexible"}</span>
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
              <div className="admin-bk-fin-val text-primary">₹{Number(booking.totalAmount).toLocaleString("en-IN")}</div>
            </div>
            <div className="admin-bk-fin-box">
              <div className="admin-bk-fin-lbl">Advance Paid</div>
              <div className="admin-bk-fin-val text-success">₹{Number(booking.advanceAmount || 0).toLocaleString("en-IN")}</div>
            </div>
            <div className="admin-bk-fin-box">
              <div className="admin-bk-fin-lbl">Remaining Balance</div>
              <div className="admin-bk-fin-val">₹{Number(booking.remainingAmount || (Number(booking.totalAmount) - Number(booking.advanceAmount || 0))).toLocaleString("en-IN")}</div>
            </div>
            <div className="admin-bk-fin-box">
              <div className="admin-bk-fin-lbl">Platform Commission</div>
              <div className="admin-bk-fin-val">₹{Number(booking.platformFee).toLocaleString("en-IN")}</div>
            </div>
          </div>

          {(booking.orderId || booking.paymentId) && (
            <div className="admin-bk-info-list mt-3">
              {booking.orderId && (
                <div className="admin-bk-info-row">
                  <span className="admin-bk-info-label">Order ID</span>
                  <span className="admin-bk-info-value">{booking.orderId}</span>
                </div>
              )}
              {booking.paymentId && (
                <div className="admin-bk-info-row">
                  <span className="admin-bk-info-label">Payment Transaction ID</span>
                  <span className="admin-bk-info-value">{booking.paymentId}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {booking.mismatchReport && (
          <div className="admin-bk-card" style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
            <div className="admin-bk-card-title" style={{ color: "#ef4444" }}>
              <i className="fas fa-exclamation-triangle"></i>
              <span>Scope Mismatch Report</span>
            </div>
            <div className="admin-bk-info-list">
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Report Status</span>
                <span className="admin-bk-info-value">
                  <span className="badge badge-danger-alert">{booking.mismatchReport.status}</span>
                </span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Provider Diagnosis</span>
                <span className="admin-bk-info-value">{booking.mismatchReport.diagnosis}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Inspection Visit Fee</span>
                <span className="admin-bk-info-value">₹{booking.mismatchReport.visitFee}</span>
              </div>
              <div className="admin-bk-info-row">
                <span className="admin-bk-info-label">Refund Amount</span>
                <span className="admin-bk-info-value">₹{booking.mismatchReport.refundAmount}</span>
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
