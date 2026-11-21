import React from "react";
import type { BookingItem, BookingStatus } from "../../types/booking.types";
import "./BookingDetailsModal.css";

interface BookingDetailsModalProps {
  booking: BookingItem | null;
  isOpen: boolean;
  role: "CUSTOMER" | "PROVIDER";
  onClose: () => void;
  onChat: (booking: BookingItem) => void;
  onUpdateStatus?: (booking: BookingItem, newStatus: BookingStatus) => void;
  onViewServiceRequest?: (serviceRequestId: string) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  booking,
  isOpen,
  role,
  onClose,
  onChat,
  onUpdateStatus,
  onViewServiceRequest
}) => {
  if (!isOpen || !booking) return null;

  const formattedScheduledDate = booking.scheduledDate
    ? new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "Flexible schedule";

  const formattedBookedDate = new Date(booking.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const counterpartyName =
    role === "CUSTOMER"
      ? booking.providerBusinessName || booking.providerName || "Assigned Provider"
      : booking.customerName || "Customer";

  const requiresInspection =
    booking.requiresInspection === true ||
    booking.quotationType === "INSPECTION_REQUIRED" ||
    booking.quotationType === "ESTIMATED" ||
    booking.status === "INSPECTION";

  const mapsUrl = booking.addressText
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.addressText)}`
    : null;

  const timelineItems = React.useMemo(() => {
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

  const renderStatusBadge = () => {
    switch (booking.status) {
      case "CONFIRMED":
        return (
          <span className="bkmodal-badge confirmed">
            <i className="fas fa-check-circle"></i>
            <span>Confirmed</span>
          </span>
        );
      case "EN_ROUTE":
        return (
          <span className="bkmodal-badge en-route">
            <i className="fas fa-route"></i>
            <span>On The Way</span>
          </span>
        );
      case "INSPECTION":
        return (
          <span className="bkmodal-badge inspection">
            <i className="fas fa-clipboard-check"></i>
            <span>Inspection</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="bkmodal-badge in-progress">
            <i className="fas fa-tools"></i>
            <span>In Progress</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="bkmodal-badge completed">
            <i className="fas fa-award"></i>
            <span>Completed</span>
          </span>
        );
      case "CLOSED":
        return (
          <span className="bkmodal-badge completed">
            <i className="fas fa-clipboard-check"></i>
            <span>Diagnosis Closed</span>
          </span>
        );
      case "CANCELLED":
        if (
          booking.mismatchReport?.status === "ACCEPTED" ||
          booking.notes?.toLowerCase().includes("diagnosis accepted") ||
          (booking.statusHistory && booking.statusHistory.some((h) => h.note?.toLowerCase().includes("diagnosis accepted")))
        ) {
          return (
            <span className="bkmodal-badge completed">
              <i className="fas fa-clipboard-check"></i>
              <span>Diagnosis Closed</span>
            </span>
          );
        }
        return (
          <span className="bkmodal-badge cancelled">
            <i className="fas fa-ban"></i>
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="bkmodal-badge confirmed">
            <span>{booking.status}</span>
          </span>
        );
    }
  };

  return (
    <div className="bkmodal-overlay" onClick={onClose}>
      <div
        className="bkmodal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="bkmodal-header">
          <div className="bkmodal-header-titles">
            <div className="bkmodal-ref-row">
              <span className="bkmodal-ref-chip">
                <i className="fas fa-receipt"></i>
                <span>{booking.bookingNumber}</span>
              </span>
              {renderStatusBadge()}
            </div>
            <h2 className="bkmodal-title">
              {booking.serviceRequestTitle || "Service Requirement"}
            </h2>
          </div>

          <button
            type="button"
            className="bkmodal-btn-close"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="bkmodal-body">
          <div className="bkmodal-escrow-card">
            <i className="fas fa-shield-alt bkmodal-escrow-icon"></i>
            <div className="bkmodal-escrow-text">
              <h4>Escrow Protection Active</h4>
              <p>
                Payment of ₹{booking.totalAmount.toLocaleString("en-IN")} is secured in BrioSolve Escrow and is only disbursed once service delivery is confirmed.
              </p>
            </div>
          </div>

          <div className="bkmodal-section">
            <h4 className="bkmodal-section-title">
              <i className={role === "CUSTOMER" ? "fas fa-user-tie" : "fas fa-user"}></i>
              <span>{role === "CUSTOMER" ? "Service Provider Details" : "Customer Details"}</span>
            </h4>

            <div className="bkmodal-counterparty-card">
              <div className="bkmodal-counterparty-avatar">
                {counterpartyName.charAt(0).toUpperCase()}
              </div>
              <div className="bkmodal-counterparty-info">
                <span className="bkmodal-counterparty-name">{counterpartyName}</span>
              </div>
              <button
                type="button"
                className="bkmodal-btn-chat-partner"
                onClick={() => {
                  onClose();
                  onChat(booking);
                }}
              >
                <i className="fas fa-comment-dots"></i>
                <span>Message</span>
              </button>
            </div>
          </div>

          <div className="bkmodal-section">
            <h4 className="bkmodal-section-title">
              <i className="far fa-calendar-alt"></i>
              <span>Schedule & Location</span>
            </h4>

            <div className="bkmodal-grid-two">
              <div className="bkmodal-info-box">
                <span className="bkmodal-info-label">Scheduled Date</span>
                <span className="bkmodal-info-value">{formattedScheduledDate}</span>
              </div>

              <div className="bkmodal-info-box">
                <span className="bkmodal-info-label">Preferred Time</span>
                <span className="bkmodal-info-value">{booking.scheduledTime || "Flexible hours"}</span>
              </div>

              <div className="bkmodal-info-box full">
                <span className="bkmodal-info-label">Service Address</span>
                <div className="bkmodal-address-line">
                  <span className="bkmodal-info-value">{booking.addressText || "Customer address on record"}</span>
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bkmodal-link-maps"
                    >
                      <i className="fas fa-external-link-alt"></i>
                      <span>Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bkmodal-section">
            <h4 className="bkmodal-section-title">
              <i className="fas fa-file-invoice-dollar"></i>
              <span>Payment Breakdown</span>
            </h4>

            <div className="bkmodal-pricing-box">
              {role === "PROVIDER" ? (
                <>
                  <div className="bkmodal-price-row">
                    <span>Agreed Service Amount</span>
                    <span>₹{Math.max(0, booking.totalAmount - booking.platformFee).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="bkmodal-price-row">
                    <span>Platform Commission (5%)</span>
                    <span>-₹{Math.round(Math.max(0, booking.totalAmount - booking.platformFee) * 0.05).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="bkmodal-price-row total">
                    <span>Take-Home Earnings</span>
                    <span>₹{Math.max(0, Math.max(0, booking.totalAmount - booking.platformFee) - Math.round(Math.max(0, booking.totalAmount - booking.platformFee) * 0.05)).toLocaleString("en-IN")}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="bkmodal-price-row">
                    <span>Agreed Service Amount</span>
                    <span>₹{(booking.totalAmount - booking.platformFee).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="bkmodal-price-row">
                    <span>Platform Assurance & Escrow Fee (5%)</span>
                    <span>₹{booking.platformFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="bkmodal-price-row total">
                    <span>Total Paid & Escrow Secured</span>
                    <span>₹{booking.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </>
              )}
            </div>

            <div className="bkmodal-meta-grid">
              <div className="bkmodal-meta-item">
                <span className="bkmodal-meta-k">Payment Security</span>
                <span className="bkmodal-meta-v">100% Escrow Secured</span>
              </div>
              <div className="bkmodal-meta-item">
                <span className="bkmodal-meta-k">Booked On</span>
                <span className="bkmodal-meta-v">{formattedBookedDate}</span>
              </div>
            </div>
          </div>

          {timelineItems.length > 0 && (
            <div className="bkmodal-section">
              <h4 className="bkmodal-section-title">
                <i className="fas fa-stream"></i>
                <span>Execution Updates & Notes</span>
              </h4>
              <div className="bkmodal-updates-list">
                {timelineItems.map((item, idx) => (
                  <div key={idx} className="bkmodal-update-row">
                    <div className="bkmodal-update-top">
                      <span className="bkmodal-update-status">{item.status.replace("_", " ")}</span>
                      <span className="bkmodal-update-time">
                        {new Date(item.timestamp).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <p className="bkmodal-notes-text">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bkmodal-footer">
          <button type="button" className="bkmodal-btn-dismiss" onClick={onClose}>
            Close
          </button>

          {role === "CUSTOMER" && onViewServiceRequest && (
            <button
              type="button"
              className="bkmodal-btn-action-outline"
              onClick={() => {
                onClose();
                onViewServiceRequest(booking.serviceRequestId);
              }}
            >
              <i className="fas fa-clipboard-list"></i>
              <span>View Service Request</span>
            </button>
          )}

          {role === "PROVIDER" && booking.status === "CONFIRMED" && onUpdateStatus && (
            <button
              type="button"
              className="bkmodal-btn-action-route"
              onClick={() => {
                onClose();
                onUpdateStatus(booking, "EN_ROUTE");
              }}
            >
              <i className="fas fa-route"></i>
              <span>On The Way</span>
            </button>
          )}

          {role === "PROVIDER" && booking.status === "EN_ROUTE" && onUpdateStatus && (
            requiresInspection ? (
              <button
                type="button"
                className="bkmodal-btn-action-inspection"
                onClick={() => {
                  onClose();
                  onUpdateStatus(booking, "INSPECTION");
                }}
              >
                <i className="fas fa-clipboard-check"></i>
                <span>Start Inspection</span>
              </button>
            ) : (
              <button
                type="button"
                className="bkmodal-btn-action-primary"
                onClick={() => {
                  onClose();
                  onUpdateStatus(booking, "IN_PROGRESS");
                }}
              >
                <i className="fas fa-tools"></i>
                <span>Start Work</span>
              </button>
            )
          )}

          {role === "PROVIDER" && booking.status === "INSPECTION" && onUpdateStatus && (
            <button
              type="button"
              className="bkmodal-btn-action-primary"
              onClick={() => {
                onClose();
                onUpdateStatus(booking, "IN_PROGRESS");
              }}
            >
              <i className="fas fa-tools"></i>
              <span>Start Work</span>
            </button>
          )}

          {role === "PROVIDER" && booking.status === "IN_PROGRESS" && onUpdateStatus && (
            <button
              type="button"
              className="bkmodal-btn-action-success"
              onClick={() => {
                onClose();
                onUpdateStatus(booking, "COMPLETED");
              }}
            >
              <i className="fas fa-check"></i>
              <span>Mark Job Completed</span>
            </button>
          )}

          <button
            type="button"
            className="bkmodal-btn-action-primary"
            onClick={() => {
              onClose();
              onChat(booking);
            }}
          >
            <i className="fas fa-comment-dots"></i>
            <span>Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
