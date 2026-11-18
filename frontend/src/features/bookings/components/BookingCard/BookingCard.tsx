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
      case "COMPLETED":
        return (
          <span className="bkcard-badge completed">
            <i className="fas fa-award"></i>
            <span>Completed</span>
          </span>
        );
      case "CANCELLED":
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

  const counterpartyName =
    role === "CUSTOMER"
      ? booking.providerBusinessName || booking.providerName || "Assigned Provider"
      : booking.customerName || "Customer";

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

        <div className="bkcard-header-right">{renderStatusBadge()}</div>
      </div>

      <div className="bkcard-body">
        <h3 className="bkcard-title" onClick={() => onViewDetails(booking)}>
          {booking.serviceRequestTitle || "Service Requirement"}
        </h3>

        <div className="bkcard-meta-row">
          <div className="bkcard-meta-tag counterparty">
            <i className={role === "CUSTOMER" ? "fas fa-user-tie" : "fas fa-user"}></i>
            <span>{role === "CUSTOMER" ? "Provider:" : "Client:"} <strong>{counterpartyName}</strong></span>
          </div>

          <div className="bkcard-meta-tag timing">
            <i className="far fa-calendar-alt"></i>
            <span>{formattedDate}{booking.scheduledTime ? ` (${booking.scheduledTime})` : ""}</span>
          </div>

          {booking.addressText && (
            <div className="bkcard-meta-tag location">
              <i className="fas fa-map-marker-alt"></i>
              <span>{booking.addressText}</span>
            </div>
          )}

          <div className="bkcard-meta-tag escrow">
            <i className="fas fa-shield-alt"></i>
            <span>Escrow Secured</span>
          </div>
        </div>
      </div>

      <div className="bkcard-footer">
        <div className="bkcard-footer-left">
          <div className="bkcard-price-block">
            <span className="bkcard-price-label">Total Amount</span>
            <span className="bkcard-price-value">₹{booking.totalAmount.toLocaleString("en-IN")}</span>
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
            <button
              type="button"
              className="bkcard-btn-action inspection"
              onClick={() => onUpdateStatus(booking, "INSPECTION")}
            >
              <i className="fas fa-clipboard-check"></i>
              <span>Start Inspection</span>
            </button>
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
