import React from "react";
import type { BookingItem, BookingStatus } from "../../types/booking.types";
import "./BookingCard.css";

interface BookingCardProps {
  booking: BookingItem;
  role: "CUSTOMER" | "PROVIDER";
  onViewDetails: (booking: BookingItem) => void;
  onChat: (booking: BookingItem) => void;
  onUpdateStatus?: (booking: BookingItem, newStatus: BookingStatus) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  role,
  onViewDetails,
  onChat,
  onUpdateStatus
}) => {
  const formattedDate = booking.scheduledDate
    ? new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : "Flexible schedule";

  const bookedAtDate = new Date(booking.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  const cancellationReason = React.useMemo<string | null>(() => {
    if (booking.status !== "CANCELLED" && booking.status !== "CLOSED") return null;
    if (booking.statusHistory && booking.statusHistory.length > 0) {
      const cancelItem = booking.statusHistory.slice().reverse().find((item) => item.status === "CANCELLED" || item.status === "CLOSED");
      if (cancelItem?.note && cancelItem.note.trim()) return cancelItem.note.trim();
    }
    if (booking.notes && booking.notes.trim()) {
      try {
        const parsed = JSON.parse(booking.notes);
        if (Array.isArray(parsed)) {
          const cancelItem = parsed.slice().reverse().find((item: any) => item.status === "CANCELLED" || item.status === "CLOSED");
          if (cancelItem?.note && cancelItem.note.trim()) return cancelItem.note.trim();
        }
      } catch {
        return booking.notes.trim();
      }
    }
    return null;
  }, [booking]);

  const cancellationAuthor = React.useMemo<string | null>(() => {
    if (booking.status !== "CANCELLED" && booking.status !== "CLOSED") return null;
    if (booking.statusHistory && booking.statusHistory.length > 0) {
      const cancelItem = booking.statusHistory.slice().reverse().find((item) => item.status === "CANCELLED" || item.status === "CLOSED");
      if (cancelItem?.authorName) return cancelItem.authorName;
    }
    if (booking.notes && booking.notes.trim()) {
      try {
        const parsed = JSON.parse(booking.notes);
        if (Array.isArray(parsed)) {
          const cancelItem = parsed.slice().reverse().find((item: any) => item.status === "CANCELLED" || item.status === "CLOSED");
          if (cancelItem?.authorName) return cancelItem.authorName;
        }
      } catch {}
    }
    return null;
  }, [booking]);

  const isDiagnosisClosed = React.useMemo<boolean>(() => {
    if (booking.status === "CLOSED") return true;
    if (booking.mismatchReport?.status === "ACCEPTED") return true;
    if (cancellationAuthor && cancellationAuthor.toLowerCase().includes("diagnosis")) return true;
    if (cancellationReason && (
      cancellationReason.toLowerCase().includes("diagnosis accepted") ||
      cancellationReason.toLowerCase().includes("scope mismatch")
    )) return true;
    return false;
  }, [booking, cancellationAuthor, cancellationReason]);

  const displayAuthor = React.useMemo<string>(() => {
    if (!cancellationAuthor) return "System";
    const lower = cancellationAuthor.toLowerCase();
    if (lower === "customer") return "Customer";
    if (lower.includes("diagnosis")) return "System (Diagnosis Closed)";
    if (lower.includes("provider")) return "Provider";
    return cancellationAuthor;
  }, [cancellationAuthor]);

  const renderStatusBadge = () => {
    switch (booking.status) {
      case "CONFIRMED":
        return (
          <span className="bkcard-badge confirmed">
            <i className="fas fa-check-circle"></i>
            <span>Confirmed</span>
          </span>
        );
      case "EN_ROUTE":
        return (
          <span className="bkcard-badge en-route">
            <i className="fas fa-route"></i>
            <span>On The Way</span>
          </span>
        );
      case "INSPECTION":
        return (
          <span className="bkcard-badge inspection">
            <i className="fas fa-clipboard-check"></i>
            <span>Inspection</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="bkcard-badge in-progress">
            <i className="fas fa-tools"></i>
            <span>In Progress</span>
          </span>
        );
      case "PAYMENT_PENDING":
        return (
          <span className="bkcard-badge payment-pending">
            <i className="fas fa-file-invoice-dollar"></i>
            <span>Payment Pending</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="bkcard-badge completed">
            <i className="fas fa-award"></i>
            <span>Completed</span>
          </span>
        );
      case "CLOSED":
        return (
          <span className="bkcard-badge closed">
            <i className="fas fa-clipboard-check"></i>
            <span>Diagnosis Closed</span>
          </span>
        );
      case "CANCELLED":
        if (isDiagnosisClosed) {
          return (
            <span className="bkcard-badge closed">
              <i className="fas fa-clipboard-check"></i>
              <span>Diagnosis Closed</span>
            </span>
          );
        }
        return (
          <span className="bkcard-badge cancelled">
            <i className="fas fa-ban"></i>
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="bkcard-badge confirmed">
            <span>{booking.status}</span>
          </span>
        );
    }
  };

  const renderWarrantyBadge = () => {
    if (booking.status !== "COMPLETED" || !booking.warranty || !booking.warranty.days || booking.warranty.days <= 0) {
      return null;
    }
    const claim = booking.warranty.claim;
    const isExpired = booking.warranty.expiresAt
      ? new Date(booking.warranty.expiresAt).getTime() < Date.now()
      : false;
    const daysRemaining = booking.warranty.expiresAt
      ? Math.max(0, Math.ceil((new Date(booking.warranty.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : booking.warranty.days;

    if (claim?.status === "PENDING") {
      return (
        <span className="bkcard-warranty-badge claim-pending" title="Warranty claim under review">
          <i className="fas fa-exclamation-circle"></i>
          <span>Claim Pending</span>
        </span>
      );
    }
    if (claim?.status === "ACCEPTED") {
      return (
        <span className="bkcard-warranty-badge claim-scheduled" title="Free warranty re-visit scheduled">
          <i className="fas fa-calendar-check"></i>
          <span>Re-visit Scheduled</span>
        </span>
      );
    }
    if (claim?.status === "REJECTED") {
      return (
        <span className="bkcard-warranty-badge claim-disputed" title="Warranty claim disputed and under investigation">
          <i className="fas fa-balance-scale"></i>
          <span>Disputed</span>
        </span>
      );
    }
    if (claim?.status === "RESOLVED") {
      return (
        <span className="bkcard-warranty-badge claim-resolved" title="Warranty re-visit resolved">
          <i className="fas fa-check-double"></i>
          <span>Warranty Resolved</span>
        </span>
      );
    }
    if (!isExpired) {
      return (
        <span className="bkcard-warranty-badge active" title="Active warranty coverage">
          <i className="fas fa-shield-alt"></i>
          <span>{daysRemaining}d Warranty</span>
        </span>
      );
    }
    return (
      <span className="bkcard-warranty-badge expired" title="Warranty coverage has ended">
        <i className="fas fa-shield-virus"></i>
        <span>Warranty Expired</span>
      </span>
    );
  };

  const renderEscrowBadge = () => {
    switch (booking.paymentStatus) {
      case "PAID":
        return (
          <span className="bkcard-escrow-badge paid">
            <i className="fas fa-check-circle"></i>
            <span>Fully Paid</span>
          </span>
        );
      case "REFUNDED":
        return (
          <span className="bkcard-escrow-badge refunded">
            <i className="fas fa-undo"></i>
            <span>Refunded</span>
          </span>
        );
      case "ADVANCE_PAID":
        return (
          <span className="bkcard-escrow-badge">
            <i className="fas fa-shield-alt"></i>
            <span>Advance Paid</span>
          </span>
        );
      default:
        return (
          <span className="bkcard-escrow-badge">
            <i className="fas fa-shield-alt"></i>
            <span>Escrow Secured</span>
          </span>
        );
    }
  };

  const counterpartyName =
    role === "CUSTOMER"
      ? booking.providerBusinessName || booking.providerName || "Assigned Provider"
      : booking.customerName || "Customer";

  const requiresInspection =
    booking.requiresInspection === true ||
    booking.quotationType === "INSPECTION_REQUIRED" ||
    booking.quotationType === "ESTIMATED" ||
    booking.status === "INSPECTION";

  return (
    <div className="bkcard-row-card">
      <div className="bkcard-header">
        <div className="bkcard-header-left">
          <div className="bkcard-ref-box">
            <i className="fas fa-calendar-check bkcard-ref-icon"></i>
            <span className="bkcard-ref-number">{booking.bookingNumber}</span>
          </div>
          <span className="bkcard-header-dot">•</span>
          <span className="bkcard-date-booked">Booked on {bookedAtDate}</span>
        </div>

        <div className="bkcard-header-right">
          {renderWarrantyBadge()}
          {renderEscrowBadge()}
          {renderStatusBadge()}
        </div>
      </div>

      <div className="bkcard-body">
        <div className="bkcard-title-row">
          <h3 className="bkcard-title" onClick={() => onViewDetails(booking)}>
            {booking.serviceRequestTitle || "Service Requirement"}
          </h3>
          {booking.categoryName && (
            <span className="bkcard-category-chip">
              <i className="fas fa-th-large"></i>
              <span>{booking.categoryName}</span>
            </span>
          )}
        </div>

        {booking.status === "COMPLETED" && booking.warranty?.claim && (
          <div className={`bkcard-warranty-claim-pill ${booking.warranty.claim.status.toLowerCase()}`}>
            <i className={
              booking.warranty.claim.status === "PENDING"
                ? "fas fa-shield-alt"
                : booking.warranty.claim.status === "ACCEPTED"
                ? "fas fa-calendar-check"
                : booking.warranty.claim.status === "REJECTED"
                ? "fas fa-balance-scale"
                : "fas fa-check-double"
            }></i>
            <div className="bkcard-cancel-info">
              <span className="bkcard-warranty-claim-title">
                {booking.warranty.claim.status === "PENDING" && "Warranty Claim Under Review"}
                {booking.warranty.claim.status === "ACCEPTED" && "Free Warranty Re-Visit Scheduled"}
                {booking.warranty.claim.status === "REJECTED" && "Warranty Claim Under Investigation"}
                {booking.warranty.claim.status === "RESOLVED" && "Warranty Re-Visit Completed"}
              </span>
              <span className="bkcard-diagnosis-desc">
                Claim: "{booking.warranty.claim.issueDescription}"
                {booking.warranty.claim.preferredDate && ` • Re-visit Date: ${booking.warranty.claim.preferredDate}`}
              </span>
            </div>
          </div>
        )}

        {isDiagnosisClosed ? (
          <div className="bkcard-diagnosis-pill">
            <i className="fas fa-stethoscope"></i>
            <div className="bkcard-cancel-info">
              <span className="bkcard-diagnosis-title">
                Closed via Diagnosis Agreement <strong>(Exempt from Cancellation Limits)</strong>
              </span>
              <span className="bkcard-diagnosis-desc">
                {booking.mismatchReport
                  ? `Technician diagnosis accepted: "${booking.mismatchReport.diagnosis}". Visit fee of ₹${booking.mismatchReport.visitFee} settled and ₹${booking.mismatchReport.refundAmount} refunded.`
                  : cancellationReason || "Booking closed safely via on-site diagnosis agreement."}
              </span>
            </div>
          </div>
        ) : (
          booking.status === "CANCELLED" && (
            <div className="bkcard-cancel-reason-pill">
              <i className="fas fa-ban"></i>
              <div className="bkcard-cancel-info">
                <span className="bkcard-cancel-author">
                  Cancelled by <strong>{displayAuthor}</strong>
                </span>
                {cancellationReason && (
                  <span className="bkcard-cancel-reason-text">Reason: "{cancellationReason}"</span>
                )}
              </div>
            </div>
          )
        )}

        <div className="bkcard-info-grid">
          <div className="bkcard-info-item">
            <div className="bkcard-info-icon-wrapper primary">
              <i className={role === "CUSTOMER" ? "fas fa-user-tie" : "fas fa-user"}></i>
            </div>
            <div className="bkcard-info-content">
              <span className="bkcard-info-label">{role === "CUSTOMER" ? "Service Provider" : "Client"}</span>
              <span className="bkcard-info-value" title={counterpartyName}>
                {counterpartyName}
              </span>
            </div>
          </div>

          <div className="bkcard-info-item">
            <div className="bkcard-info-icon-wrapper">
              <i className="far fa-calendar-alt"></i>
            </div>
            <div className="bkcard-info-content">
              <span className="bkcard-info-label">Schedule</span>
              <span className="bkcard-info-value">
                {formattedDate} {booking.scheduledTime ? `(${booking.scheduledTime})` : ""}
              </span>
            </div>
          </div>

          <div className="bkcard-info-item">
            <div className="bkcard-info-icon-wrapper">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="bkcard-info-content">
              <span className="bkcard-info-label">Service Location</span>
              <span className="bkcard-info-value location-text" title={booking.addressText || "On-site Service"}>
                {booking.addressText || "On-site Service"}
              </span>
            </div>
          </div>

          <div className="bkcard-info-item">
            <div className="bkcard-info-icon-wrapper">
              <i className={requiresInspection ? "fas fa-clipboard-check" : "fas fa-tag"}></i>
            </div>
            <div className="bkcard-info-content">
              <span className="bkcard-info-label">Pricing Model</span>
              <span className="bkcard-info-value">
                {requiresInspection ? "Inspection Required" : "Fixed Price"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bkcard-footer">
        <div className="bkcard-footer-left">
          <div className="bkcard-price-block">
            <span className="bkcard-price-label">Total Amount</span>
            <div className="bkcard-price-row">
              <span className="bkcard-price-value">₹{booking.totalAmount.toLocaleString("en-IN")}</span>
              {booking.advanceAmount && booking.advanceAmount < booking.totalAmount ? (
                <span className="bkcard-price-subtext">
                  (Advance: ₹{Number(booking.advanceAmount).toLocaleString("en-IN")})
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="bkcard-footer-right">
          <button
            type="button"
            className="bkcard-btn-chat"
            onClick={() => onChat(booking)}
            title={role === "CUSTOMER" ? "Chat with Provider" : "Chat with Customer"}
          >
            <i className="fas fa-comment-dots"></i>
            <span>Chat</span>
          </button>

          <button
            type="button"
            className="bkcard-btn-details"
            onClick={() => onViewDetails(booking)}
          >
            <i className="fas fa-file-contract"></i>
            <span>Booking Details</span>
          </button>

          {role === "CUSTOMER" && (booking.status === "CONFIRMED" || booking.status === "EN_ROUTE") && onUpdateStatus && (
            <button
              type="button"
              className="bkcard-btn-action danger"
              onClick={() => onUpdateStatus(booking, "CANCELLED")}
              title="Cancel booking before technician departs"
            >
              <i className="fas fa-times-circle"></i>
              <span>Cancel</span>
            </button>
          )}

          {role === "PROVIDER" && booking.status === "CONFIRMED" && onUpdateStatus && (
            <button
              type="button"
              className="bkcard-btn-action route"
              onClick={() => onUpdateStatus(booking, "EN_ROUTE")}
            >
              <i className="fas fa-route"></i>
              <span>On The Way</span>
            </button>
          )}

          {role === "PROVIDER" && booking.status === "EN_ROUTE" && onUpdateStatus && (
            requiresInspection ? (
              <button
                type="button"
                className="bkcard-btn-action inspection"
                onClick={() => onUpdateStatus(booking, "INSPECTION")}
              >
                <i className="fas fa-clipboard-check"></i>
                <span>Start Inspection</span>
              </button>
            ) : (
              <button
                type="button"
                className="bkcard-btn-action primary"
                onClick={() => onUpdateStatus(booking, "IN_PROGRESS")}
              >
                <i className="fas fa-tools"></i>
                <span>Start Work</span>
              </button>
            )
          )}

          {role === "PROVIDER" && booking.status === "INSPECTION" && onUpdateStatus && (
            <button
              type="button"
              className="bkcard-btn-action primary"
              onClick={() => onUpdateStatus(booking, "IN_PROGRESS")}
            >
              <i className="fas fa-tools"></i>
              <span>Start Work</span>
            </button>
          )}

          {role === "PROVIDER" && booking.status === "IN_PROGRESS" && onUpdateStatus && (
            <button
              type="button"
              className="bkcard-btn-action success"
              onClick={() => onUpdateStatus(booking, "COMPLETED")}
            >
              <i className="fas fa-check"></i>
              <span>Mark Completed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
