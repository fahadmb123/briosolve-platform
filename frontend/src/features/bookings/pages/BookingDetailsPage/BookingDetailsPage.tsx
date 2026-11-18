import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGetBookingById, useUpdateBookingStatus } from "../../hooks/useBookingMutations";
import type { BookingItem, BookingStatus } from "../../types/booking.types";
import { BookingStatusModal } from "../../components";
import "./BookingDetailsPage.css";

interface BookingDetailsPageProps {
  role?: "customer" | "provider";
}

export const BookingDetailsPage: React.FC<BookingDetailsPageProps> = ({ role: roleProp }) => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const role: "customer" | "provider" =
    roleProp || (location.pathname.startsWith("/provider") ? "provider" : "customer");
  const isProvider = role === "provider";

  const initialBooking = (location.state as { booking?: BookingItem } | null)?.booking || null;

  const { data: responseData, isLoading, error, refetch } = useGetBookingById(bookingId);
  const updateStatusMutation = useUpdateBookingStatus();

  const booking: BookingItem | null = responseData?.data || initialBooking;

  const [statusModalBooking, setStatusModalBooking] = useState<BookingItem | null>(null);
  const [targetStatus, setTargetStatus] = useState<BookingStatus | null>(null);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleBack = () => {
    if (isProvider) {
      navigate("/provider/bookings");
    } else {
      navigate("/bookings");
    }
  };

  const handleChat = () => {
    if (!booking) return;
    if (isProvider) {
      if (!booking.customerId) {
        toast.error("Customer details are unavailable for this booking");
        return;
      }
      navigate(`/provider/messages?recipientId=${booking.customerId}`, {
        state: {
          recipientId: booking.customerId,
          recipientName: booking.customerName || "Customer",
          requestId: booking.serviceRequestId,
          requestTitle: booking.serviceRequestTitle || "Service Job",
          categoryName: booking.categoryName || undefined,
          location: booking.addressText || undefined
        }
      });
    } else {
      const targetProviderId = booking.providerUserId || booking.providerId;
      if (!targetProviderId) {
        toast.error("Provider details are unavailable for this booking");
        return;
      }
      navigate(`/messages?recipientId=${targetProviderId}`, {
        state: {
          recipientId: targetProviderId,
          recipientName: booking.providerBusinessName || booking.providerName || "Service Provider",
          requestId: booking.serviceRequestId,
          requestTitle: booking.serviceRequestTitle || "Service Booking",
          categoryName: booking.categoryName || undefined,
          location: booking.addressText || undefined
        }
      });
    }
  };

  const handleViewServiceRequest = () => {
    if (!booking) return;
    if (isProvider) {
      navigate(`/provider/service-requests/${booking.serviceRequestId}`);
    } else {
      navigate(`/my-requests/${booking.serviceRequestId}`);
    }
  };

  const handleTriggerStatusChange = (newStatus: BookingStatus) => {
    if (!booking) return;
    setStatusModalBooking(booking);
    setTargetStatus(newStatus);
  };

  const handleCloseStatusModal = () => {
    setStatusModalBooking(null);
    setTargetStatus(null);
  };

  const handleConfirmStatusChange = (
    item: BookingItem,
    newStatus: BookingStatus,
    notes?: string
  ) => {
    updateStatusMutation.mutate(
      {
        id: item.id,
        payload: {
          status: newStatus,
          notes
        }
      },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "IN_PROGRESS"
              ? "Job marked as In Progress"
              : newStatus === "COMPLETED"
              ? "Job marked as Completed"
              : "Booking status updated"
          );
          handleCloseStatusModal();
          refetch();
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || err?.message || "Failed to update booking status"
          );
        }
      }
    );
  };

  if (isLoading && !booking) {
    return (
      <div className={`bkdet-page-container ${isProvider ? "is-provider" : "is-customer"}`}>
        <div className="bkdet-loading-box">
          <div className="bkdet-loading-spinner" />
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if ((error && !booking) || (!booking && !isLoading)) {
    return (
      <div className={`bkdet-page-container ${isProvider ? "is-provider" : "is-customer"}`}>
        <button type="button" className="bkdet-back-link" onClick={handleBack}>
          <i className="fas fa-arrow-left" />
          <span>Back to Bookings</span>
        </button>
        <div className="bkdet-error-box">
          <img
            src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
            alt="No booking found"
            className="bkdet-empty-img"
            onError={(e) => {
              e.currentTarget.src = "/images/no-data.png";
            }}
          />
          <h3 className="bkdet-error-title">No Booking Record Found</h3>
          <p className="bkdet-error-desc">
            We could not find or retrieve this booking record.
          </p>
          <button type="button" className="bkdet-action-btn primary" onClick={() => refetch()}>
            <i className="fas fa-redo" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const dateObj = booking.scheduledDate ? new Date(booking.scheduledDate) : null;
  const monthAbbr = dateObj
    ? dateObj.toLocaleDateString("en-IN", { month: "short" }).toUpperCase()
    : "DATE";
  const dayNum = dateObj ? dateObj.getDate() : "--";
  const fullDateText = dateObj
    ? dateObj.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : "Flexible schedule";

  const timeSlotText = booking.scheduledTime || "Schedule window as agreed with provider";

  const counterpartyName = isProvider
    ? booking.customerName || "Customer"
    : booking.providerBusinessName || booking.providerName || "Service Provider";
  const counterpartyPhone = isProvider ? booking.customerPhone : booking.providerPhone;
  const counterpartyInitial = counterpartyName.charAt(0).toUpperCase();

  const mapsUrl = booking.addressText
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.addressText)}`
    : null;

  const isConfirmed = booking.status === "CONFIRMED";
  const isInProgress = booking.status === "IN_PROGRESS";
  const isCompleted = booking.status === "COMPLETED";

  const stepProgressPercent = isCompleted ? 100 : isInProgress ? 50 : 0;

  return (
    <div className={`bkdet-page-container ${isProvider ? "is-provider" : "is-customer"}`}>
      <button type="button" className="bkdet-back-link" onClick={handleBack}>
        <i className="fas fa-arrow-left" />
        <span>Back to Bookings</span>
      </button>

      <div className="bkdet-breadcrumb">
        <span className={`bkdet-role-badge ${isProvider ? "provider" : "customer"}`}>
          {isProvider ? "Provider Portal" : "Customer"}
        </span>
        <span className="sep">/</span>
        <span className="bkdet-crumb-link" onClick={handleBack} style={{ cursor: "pointer" }}>
          Bookings
        </span>
        <span className="sep">/</span>
        <span className="active">{booking.bookingNumber}</span>
      </div>

      <div className="bkdet-header-card">
        <div className="bkdet-header-left">
          <div className="bkdet-badge-row">
            <span className="bkdet-ref-pill">
              <i className="fas fa-calendar-check" />
              <span>{booking.bookingNumber}</span>
            </span>

            {booking.categoryName && (
              <span className="bkdet-category-pill">
                <i className="fas fa-tag" />
                <span>{booking.categoryName}</span>
              </span>
            )}

            <span className={`bkdet-status-badge ${booking.status.toLowerCase().replace("_", "-")}`}>
              <i
                className={`fas ${
                  isConfirmed
                    ? "fa-check-circle"
                    : isInProgress
                    ? "fa-clock"
                    : isCompleted
                    ? "fa-badge-check"
                    : "fa-times-circle"
                }`}
              />
              <span>{booking.status.replace("_", " ")}</span>
            </span>
          </div>

          <h1 className="bkdet-title">
            {booking.serviceRequestTitle || "Service Job Booking"}
          </h1>

          <span className="bkdet-created-date">
            Booked on{" "}
            {new Date(booking.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </div>

        <div className="bkdet-header-actions">
          <button type="button" className="bkdet-action-btn outline" onClick={handleChat}>
            <i className="fas fa-comment-dots" />
            <span>Chat</span>
          </button>

          {counterpartyPhone && (
            <a href={`tel:${counterpartyPhone}`} className="bkdet-action-btn outline">
              <i className="fas fa-phone-alt" />
              <span>Call</span>
            </a>
          )}

          {isProvider && isConfirmed && (
            <button
              type="button"
              className="bkdet-action-btn primary"
              onClick={() => handleTriggerStatusChange("IN_PROGRESS")}
            >
              <i className="fas fa-play" />
              <span>Start Job</span>
            </button>
          )}

          {isProvider && isInProgress && (
            <button
              type="button"
              className="bkdet-action-btn success"
              onClick={() => handleTriggerStatusChange("COMPLETED")}
            >
              <i className="fas fa-check-circle" />
              <span>Complete Job</span>
            </button>
          )}
        </div>
      </div>

      <div className="bkdet-layout-grid">
        <div className="bkdet-col-main">
          <div className="bkdet-section-card">
            <div className="bkdet-section-header">
              <div className="bkdet-section-title-wrap">
                <div className="bkdet-section-icon">
                  <i className="fas fa-calendar-day" />
                </div>
                <h3 className="bkdet-section-title">Schedule & Appointment</h3>
              </div>
            </div>

            <div className="bkdet-schedule-block">
              <div className="bkdet-calendar-tile">
                <div className="bkdet-cal-month">{monthAbbr}</div>
                <div className="bkdet-cal-day">{dayNum}</div>
              </div>
              <div className="bkdet-schedule-details">
                <div className="bkdet-schedule-headline">{fullDateText}</div>
                <div className="bkdet-schedule-sub">
                  <i className="far fa-clock" />
                  <span>{timeSlotText}</span>
                </div>
              </div>
            </div>

            <div className="bkdet-stepper">
              <div className="bkdet-step-line">
                <div className="bkdet-step-line-fill" style={{ width: `${stepProgressPercent}%` }} />
              </div>

              <div className={`bkdet-step-item ${isConfirmed || isInProgress || isCompleted ? "done" : ""}`}>
                <div className="bkdet-step-circle">
                  <i className="fas fa-check" />
                </div>
                <span className="bkdet-step-label">Confirmed</span>
              </div>

              <div className={`bkdet-step-item ${isInProgress || isCompleted ? "done" : isConfirmed ? "active" : ""}`}>
                <div className="bkdet-step-circle">
                  <i className="fas fa-tools" />
                </div>
                <span className="bkdet-step-label">In Progress</span>
              </div>

              <div className={`bkdet-step-item ${isCompleted ? "done" : ""}`}>
                <div className="bkdet-step-circle">
                  <i className="fas fa-star" />
                </div>
                <span className="bkdet-step-label">Completed</span>
              </div>
            </div>
          </div>

          <div className="bkdet-section-card">
            <div className="bkdet-section-header">
              <div className="bkdet-section-title-wrap">
                <div className="bkdet-section-icon">
                  <i className="fas fa-clipboard-list" />
                </div>
                <h3 className="bkdet-section-title">Service Details</h3>
              </div>
            </div>

            <div className="bkdet-meta-grid">
              <div className="bkdet-meta-box">
                <div className="bkdet-meta-box-label">Service Request</div>
                <div className="bkdet-meta-box-value">
                  {booking.serviceRequestTitle || "Service Job"}
                </div>
              </div>

              <div className="bkdet-meta-box">
                <div className="bkdet-meta-box-label">Category</div>
                <div className="bkdet-meta-box-value">
                  {booking.categoryName || "Home & Local Service"}
                </div>
              </div>

              <div className="bkdet-meta-box">
                <div className="bkdet-meta-box-label">Quotation Ref</div>
                <div className="bkdet-meta-box-value" style={{ fontFamily: "monospace" }}>
                  {booking.quotationId.slice(0, 8)}...
                </div>
              </div>
            </div>

            {booking.notes && (
              <div>
                <h4 style={{ margin: "0 0 6px", fontSize: "0.9rem", color: "#475569" }}>
                  Job Notes & Instructions
                </h4>
                <p className="bkdet-scope-text">{booking.notes}</p>
              </div>
            )}

            <button type="button" className="bkdet-link-btn" onClick={handleViewServiceRequest}>
              <i className="fas fa-external-link-alt" />
              <span>View Original Service Request</span>
            </button>
          </div>

          <div className="bkdet-section-card">
            <div className="bkdet-section-header">
              <div className="bkdet-section-title-wrap">
                <div className="bkdet-section-icon">
                  <i className="fas fa-map-marker-alt" />
                </div>
                <h3 className="bkdet-section-title">Service Location</h3>
              </div>
            </div>

            <div className="bkdet-address-row">
              <div className="bkdet-address-pin">
                <i className="fas fa-location-arrow" />
              </div>
              <div className="bkdet-address-content">
                <div className="bkdet-address-title">Service Address</div>
                <div className="bkdet-address-text">
                  {booking.addressText || "Customer address registered on file"}
                </div>
              </div>
            </div>

            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bkdet-directions-btn"
              >
                <i className="fas fa-directions" />
                <span>Open in Google Maps / Get Directions</span>
              </a>
            )}
          </div>
        </div>

        <div className="bkdet-col-side">
          <div className="bkdet-section-card bkdet-escrow-card">
            <div className="bkdet-section-header">
              <div className="bkdet-section-title-wrap">
                <div className="bkdet-section-icon">
                  <i className="fas fa-shield-alt" />
                </div>
                <h3 className="bkdet-section-title">Payment & Escrow</h3>
              </div>
            </div>

            <div className="bkdet-price-huge">
              {formatCurrency(booking.totalAmount)}
            </div>

            <div className="bkdet-escrow-badge">
              <i className="fas fa-lock" />
              <div className="bkdet-escrow-badge-text">
                <strong>100% Escrow Secured.</strong> The payment is safely locked by BrioSolve and only released after verified job completion.
              </div>
            </div>

            <div className="bkdet-meta-grid" style={{ gridTemplateColumns: "1fr", gap: "8px" }}>
              <div className="bkdet-meta-box">
                <div className="bkdet-meta-box-label">Payment Status</div>
                <div className="bkdet-meta-box-value" style={{ color: "#16a34a" }}>
                  Escrow Funded & Verified
                </div>
              </div>

              {booking.orderId && (
                <div className="bkdet-meta-box">
                  <div className="bkdet-meta-box-label">Order Ref</div>
                  <div className="bkdet-meta-box-value" style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>
                    {booking.orderId}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bkdet-section-card">
            <div className="bkdet-section-header">
              <div className="bkdet-section-title-wrap">
                <div className="bkdet-section-icon">
                  <i className="fas fa-user-circle" />
                </div>
                <h3 className="bkdet-section-title">
                  {isProvider ? "Client Details" : "Provider Details"}
                </h3>
              </div>
            </div>

            <div className="bkdet-counterparty-row">
              <div className="bkdet-counterparty-avatar">
                {counterpartyInitial}
              </div>
              <div className="bkdet-counterparty-info">
                <span className="bkdet-counterparty-role">
                  {isProvider ? "Customer" : "Verified Provider"}
                </span>
                <span className="bkdet-counterparty-name">
                  {counterpartyName}
                </span>
                {counterpartyPhone && (
                  <a href={`tel:${counterpartyPhone}`} className="bkdet-counterparty-phone">
                    <i className="fas fa-phone-alt" />
                    <span>{counterpartyPhone}</span>
                  </a>
                )}
              </div>
            </div>

            <div className="bkdet-contact-actions">
              <button type="button" className="bkdet-contact-btn" onClick={handleChat}>
                <i className="fas fa-comment-dots" />
                <span>Message</span>
              </button>

              {counterpartyPhone && (
                <a href={`tel:${counterpartyPhone}`} className="bkdet-contact-btn">
                  <i className="fas fa-phone-alt" />
                  <span>Call</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {isProvider && (
        <BookingStatusModal
          booking={statusModalBooking}
          targetStatus={targetStatus}
          isOpen={Boolean(statusModalBooking && targetStatus)}
          onClose={handleCloseStatusModal}
          onConfirm={handleConfirmStatusChange}
          isLoading={updateStatusMutation.isPending}
        />
      )}
    </div>
  );
};
