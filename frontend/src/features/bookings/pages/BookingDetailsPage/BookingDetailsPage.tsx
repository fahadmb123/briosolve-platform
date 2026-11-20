import React, { useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGetBookingById, useUpdateBookingStatus } from "../../hooks/useBookingMutations";
import type { BookingItem, BookingStatus, BookingStatusHistoryItem } from "../../types/booking.types";
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
    notes?: string,
    totalAmount?: number
  ) => {
    updateStatusMutation.mutate(
      {
        id: item.id,
        payload: {
          status: newStatus,
          notes,
          totalAmount
        }
      },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "EN_ROUTE"
              ? "Technician marked as On The Way"
              : newStatus === "INSPECTION"
                ? "Inspection / Diagnostic started"
                : newStatus === "IN_PROGRESS"
                  ? "Job marked as In Progress"
                  : newStatus === "PAYMENT_PENDING"
                    ? "Total payment confirmed and sent to customer"
                    : newStatus === "COMPLETED"
                      ? "Job marked as Completed"
                      : newStatus === "CANCELLED"
                        ? "Booking cancelled. 100% refund initiated to customer."
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

  const getStatusMeta = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return { label: "Confirmed", icon: "fas fa-check-circle", variant: "confirmed" };
      case "EN_ROUTE":
        return { label: "On The Way", icon: "fas fa-route", variant: "route" };
      case "INSPECTION":
        return { label: "Inspection", icon: "fas fa-clipboard-check", variant: "inspection" };
      case "IN_PROGRESS":
        return { label: "In Progress", icon: "fas fa-tools", variant: "in-progress" };
      case "PAYMENT_PENDING":
        return { label: "Payment Pending", icon: "fas fa-file-invoice-dollar", variant: "warning" };
      case "COMPLETED":
        return { label: "Completed", icon: "fas fa-award", variant: "completed" };
      case "CANCELLED":
        return { label: "Cancelled", icon: "fas fa-ban", variant: "cancelled" };
      default:
        return { label: status, icon: "fas fa-info-circle", variant: "confirmed" };
    }
  };

  const timelineItems = useMemo<BookingStatusHistoryItem[]>(() => {
    if (!booking) return [];
    if (booking.statusHistory && booking.statusHistory.length > 0) {
      return booking.statusHistory;
    }
    const items: BookingStatusHistoryItem[] = [
      {
        status: "CONFIRMED",
        note: "Booking confirmed and payment escrow secured.",
        timestamp: booking.createdAt,
        authorName: "System"
      }
    ];
    if (booking.notes && booking.notes.trim()) {
      try {
        const parsed = JSON.parse(booking.notes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        items.push({
          status: booking.status,
          note: booking.notes,
          timestamp: booking.updatedAt,
          authorName: booking.providerBusinessName || booking.providerName || "Service Provider"
        });
      }
    }
    return items;
  }, [booking]);

  const cancellationReason = useMemo<string | null>(() => {
    if (!booking) return null;
    if (timelineItems.length > 0) {
      const cancelItem = timelineItems.slice().reverse().find((item) => item.status === "CANCELLED");
      if (cancelItem?.note && cancelItem.note.trim()) {
        return cancelItem.note.trim();
      }
    }
    if (booking.notes && booking.notes.trim()) {
      try {
        const parsed = JSON.parse(booking.notes);
        if (Array.isArray(parsed)) {
          const cancelItem = parsed.slice().reverse().find((item: any) => item.status === "CANCELLED");
          if (cancelItem?.note && cancelItem.note.trim()) return cancelItem.note.trim();
        }
      } catch {
        return booking.notes.trim();
      }
    }
    return null;
  }, [booking, timelineItems]);

  const cancellationAuthor = useMemo<string | null>(() => {
    if (!booking) return null;
    if (timelineItems.length > 0) {
      const cancelItem = timelineItems.slice().reverse().find((item) => item.status === "CANCELLED");
      if (cancelItem?.authorName) return cancelItem.authorName;
    }
    if (booking.notes && booking.notes.trim()) {
      try {
        const parsed = JSON.parse(booking.notes);
        if (Array.isArray(parsed)) {
          const cancelItem = parsed.slice().reverse().find((item: any) => item.status === "CANCELLED");
          if (cancelItem?.authorName) return cancelItem.authorName;
        }
      } catch {}
    }
    return null;
  }, [booking, timelineItems]);

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
  const counterpartyInitial = counterpartyName.charAt(0).toUpperCase();

  const mapsUrl = booking.addressText
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.addressText)}`
    : null;

  const isConfirmed = booking.status === "CONFIRMED";
  const isEnRoute = booking.status === "EN_ROUTE";
  const isInspection = booking.status === "INSPECTION";
  const isInProgress = booking.status === "IN_PROGRESS";
  const isPaymentPending = booking.status === "PAYMENT_PENDING";
  const isCompleted = booking.status === "COMPLETED";
  const isCancelled = booking.status === "CANCELLED";

  const totalAmount = booking.totalAmount || 0;
  const advanceAmount = booking.advanceAmount || totalAmount;
  const quotationType =
    booking.quotationType || (booking.requiresInspection ? "INSPECTION_REQUIRED" : "FIXED");
  const isFixedQuote = quotationType === "FIXED";
  const isEstimatedQuote = quotationType === "ESTIMATED";
  const isInspectionQuote = quotationType === "INSPECTION_REQUIRED";
  const isFinalConfirmed = Boolean(booking.isFinalConfirmed || isFixedQuote || isPaymentPending || isCompleted);
  const remainingAmount = isFinalConfirmed
    ? (booking.remainingAmount ?? Math.max(0, totalAmount - advanceAmount))
    : 0;
  const platformFee = booking.platformFee || Math.round((totalAmount / 1.1) * 0.1);
  const baseAmount = Math.max(0, totalAmount - platformFee);

  const isAdvancePaid = booking.paymentStatus === "ADVANCE_PAID";
  const isFullyPaid = booking.paymentStatus === "PAID";

  const requiresInspection =
    booking.requiresInspection === true ||
    quotationType === "INSPECTION_REQUIRED" ||
    quotationType === "ESTIMATED" ||
    booking.status === "INSPECTION";

  const stepProgressPercent = isFixedQuote
    ? isCompleted
      ? 100
      : isInProgress
        ? 66
        : isEnRoute
          ? 33
          : 0
    : requiresInspection
      ? isCompleted
        ? 100
        : isPaymentPending
          ? 80
          : isInProgress
            ? 60
            : isInspection
              ? 40
              : isEnRoute
                ? 20
                : 0
      : isCompleted
        ? 100
        : isPaymentPending
          ? 75
          : isInProgress
            ? 50
            : isEnRoute
              ? 25
              : 0;

  return (
    <div className={`bkdet-page-container ${isProvider ? "is-provider" : "is-customer"}`}>
      <button type="button" className="bkdet-back-link" onClick={handleBack}>
        <i className="fas fa-arrow-left" />
        <span>Back to Bookings</span>
      </button>

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

            <span className={`bkdet-type-pill ${requiresInspection ? "inspection" : "type-fixed"}`}>
              <i className={requiresInspection ? "fas fa-clipboard-check" : "fas fa-lock"} />
              <span>{requiresInspection ? "Inspection Required" : "Fixed Price"}</span>
            </span>

            <span className={`bkdet-status-badge ${booking.status.toLowerCase().replace(/_/g, "-")}`}>
              <i
                className={`fas ${isConfirmed
                  ? "fa-check-circle"
                  : isEnRoute
                    ? "fa-route"
                    : isInspection
                      ? "fa-clipboard-check"
                      : isInProgress
                        ? "fa-tools"
                        : isPaymentPending
                          ? "fa-file-invoice-dollar"
                          : isCompleted
                            ? "fa-award"
                            : "fa-times-circle"
                  }`}
              />
              <span>
                {booking.status === "EN_ROUTE"
                  ? "On The Way"
                  : booking.status === "INSPECTION"
                    ? "Inspection"
                    : booking.status === "PAYMENT_PENDING"
                      ? "Payment Pending"
                      : booking.status.replace(/_/g, " ")}
              </span>
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

          {isProvider && isConfirmed && (
            <>
              <button
                type="button"
                className="bkdet-action-btn danger-outline"
                onClick={() => handleTriggerStatusChange("CANCELLED")}
              >
                <i className="fas fa-times-circle" />
                <span>Cancel Booking</span>
              </button>
              <button
                type="button"
                className="bkdet-action-btn route"
                onClick={() => handleTriggerStatusChange("EN_ROUTE")}
              >
                <i className="fas fa-route" />
                <span>On The Way</span>
              </button>
            </>
          )}

          {!isProvider && isConfirmed && (
            <button
              type="button"
              className="bkdet-action-btn danger-outline"
              onClick={() => handleTriggerStatusChange("CANCELLED")}
            >
              <i className="fas fa-times-circle" />
              <span>Cancel Booking</span>
            </button>
          )}

          {isProvider && isEnRoute && (
            requiresInspection ? (
              <button
                type="button"
                className="bkdet-action-btn inspection"
                onClick={() => handleTriggerStatusChange("INSPECTION")}
              >
                <i className="fas fa-clipboard-check" />
                <span>Start Inspection</span>
              </button>
            ) : (
              <button
                type="button"
                className="bkdet-action-btn primary"
                onClick={() => handleTriggerStatusChange("IN_PROGRESS")}
              >
                <i className="fas fa-tools" />
                <span>Start Work</span>
              </button>
            )
          )}

          {isProvider && isInspection && (
            <button
              type="button"
              className="bkdet-action-btn primary"
              onClick={() => handleTriggerStatusChange("IN_PROGRESS")}
            >
              <i className="fas fa-tools" />
              <span>Start Work</span>
            </button>
          )}

          {isProvider && isInProgress && (
            isFixedQuote ? (
              <button
                type="button"
                className="bkdet-action-btn success"
                onClick={() => handleTriggerStatusChange("COMPLETED")}
              >
                <i className="fas fa-check-double" />
                <span>Mark Completed</span>
              </button>
            ) : (
              <button
                type="button"
                className="bkdet-action-btn primary"
                onClick={() => handleTriggerStatusChange("PAYMENT_PENDING")}
              >
                <i className="fas fa-file-invoice-dollar" />
                <span>Confirm Total & Request Payment</span>
              </button>
            )
          )}

          {isProvider && !isFixedQuote && isPaymentPending && (
            <button
              type="button"
              className="bkdet-action-btn success"
              onClick={() => handleTriggerStatusChange("COMPLETED")}
            >
              <i className="fas fa-check-circle" />
              <span>Mark as Paid & Complete</span>
            </button>
          )}
        </div>
      </div>

      {isCancelled && (
        <div className="bkdet-cancelled-banner">
          <div className="bkdet-cb-left">
            <div className="bkdet-cb-icon">
              <i className="fas fa-ban" />
            </div>
            <div>
              <h4 className="bkdet-cb-title">
                Booking Cancelled Before Service Dispatch
              </h4>
              <p className="bkdet-cb-desc">
                {isProvider
                  ? cancellationAuthor === "Customer"
                    ? `This booking was cancelled by the customer before dispatch. Escrow advance has been refunded to the customer.`
                    : `You cancelled this booking before dispatch. A 100% full refund of ${formatCurrency(advanceAmount)} secured in Escrow has been processed for the customer.`
                  : cancellationAuthor === "Customer"
                    ? `You cancelled this booking before dispatch. Your full payment of ${formatCurrency(advanceAmount)} held safely in Escrow has been 100% refunded.`
                    : `This booking was cancelled by the provider before dispatch. Your full payment of ${formatCurrency(advanceAmount)} held safely in Escrow has been 100% refunded.`}
              </p>
              {cancellationReason && (
                <div className="bkdet-cb-reason-box">
                  <span className="bkdet-cb-reason-badge">
                    <i className="fas fa-comment-alt" /> Reason
                  </span>
                  <span className="bkdet-cb-reason-text">"{cancellationReason}"</span>
                </div>
              )}
            </div>
          </div>
          {!isProvider && (
            <button
              type="button"
              className="bkdet-cb-btn"
              onClick={handleViewServiceRequest}
            >
              <i className="fas fa-redo-alt" />
              <span>Find Another Provider</span>
            </button>
          )}
        </div>
      )}

      {!isFixedQuote && isPaymentPending && (
        <div className="bkdet-payment-pending-banner">
          <div className="bkdet-ppb-left">
            <div className="bkdet-ppb-icon">
              <i className="fas fa-file-invoice-dollar" />
            </div>
            <div>
              <h4 className="bkdet-ppb-title">
                {isProvider
                  ? isFixedQuote
                    ? "Work Completed — Awaiting Customer Settlement"
                    : "Final Total Confirmed — Awaiting Customer Settlement"
                  : isFixedQuote
                    ? "Work Completed — Final Payment Due"
                    : "Work Completed & Total Confirmed — Final Payment Due"}
              </h4>
              <p className="bkdet-ppb-desc">
                {isProvider
                  ? isFixedQuote
                    ? `You completed the work under the fixed price agreement of ${formatCurrency(totalAmount)}. The customer has been requested to settle the remaining balance of ${formatCurrency(remainingAmount)}.`
                    : `You confirmed the final total of ${formatCurrency(totalAmount)}. The customer has been requested to settle the remaining balance of ${formatCurrency(remainingAmount)}.`
                  : isFixedQuote
                    ? `The provider completed the work for the agreed fixed price of ${formatCurrency(totalAmount)}. Please settle the remaining balance of ${formatCurrency(remainingAmount)} to conclude the booking.`
                    : `The provider completed the work and confirmed the final total of ${formatCurrency(totalAmount)}. Please settle the remaining balance of ${formatCurrency(remainingAmount)} to conclude the booking.`}
              </p>
            </div>
          </div>
          <div className="bkdet-ppb-actions">
            {!isProvider && (
              <button
                type="button"
                className="bkdet-action-btn success"
                onClick={() =>
                  handleConfirmStatusChange(
                    booking,
                    "COMPLETED",
                    "Final balance payment confirmed by client. Escrow released."
                  )
                }
              >
                <i className="fas fa-lock" />
                <span>Pay Balance ({formatCurrency(remainingAmount)}) & Complete</span>
              </button>
            )}
            {isProvider && (
              <button
                type="button"
                className="bkdet-action-btn success"
                onClick={() => handleTriggerStatusChange("COMPLETED")}
              >
                <i className="fas fa-check-circle" />
                <span>Mark Paid & Complete</span>
              </button>
            )}
          </div>
        </div>
      )}

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

            <div className={`bkdet-stepper ${requiresInspection ? "has-inspection" : "fixed-flow"}`}>
              <div className="bkdet-step-line">
                <div className="bkdet-step-line-fill" style={{ width: `${stepProgressPercent}%` }} />
              </div>

              <div className={`bkdet-step-item ${isEnRoute || isInspection || isInProgress || isPaymentPending || isCompleted ? "done" : isConfirmed ? "active" : ""}`}>
                <div className="bkdet-step-circle">
                  <i className="fas fa-check" />
                </div>
                <span className="bkdet-step-label">Confirmed</span>
              </div>

              <div className={`bkdet-step-item ${(requiresInspection ? (isInspection || isInProgress || isPaymentPending || isCompleted) : (isInProgress || isPaymentPending || isCompleted)) ? "done" : isEnRoute ? "active" : ""}`}>
                <div className="bkdet-step-circle">
                  <i className="fas fa-route" />
                </div>
                <span className="bkdet-step-label">On The Way</span>
              </div>

              {requiresInspection && (
                <div className={`bkdet-step-item ${isInProgress || isPaymentPending || isCompleted ? "done" : isInspection ? "active" : ""}`}>
                  <div className="bkdet-step-circle">
                    <i className="fas fa-clipboard-check" />
                  </div>
                  <span className="bkdet-step-label">Inspection</span>
                </div>
              )}

              <div className={`bkdet-step-item ${isPaymentPending || isCompleted ? "done" : isInProgress ? "active" : ""}`}>
                <div className="bkdet-step-circle">
                  <i className="fas fa-tools" />
                </div>
                <span className="bkdet-step-label">In Progress</span>
              </div>

              {!isFixedQuote && (
                <div className={`bkdet-step-item ${isCompleted ? "done" : isPaymentPending ? "active" : ""}`}>
                  <div className="bkdet-step-circle">
                    <i className="fas fa-file-invoice-dollar" />
                  </div>
                  <span className="bkdet-step-label">Payment Due</span>
                </div>
              )}

              <div className={`bkdet-step-item ${isCompleted ? "done" : ""}`}>
                <div className="bkdet-step-circle">
                  <i className="fas fa-award" />
                </div>
                <span className="bkdet-step-label">Completed</span>
              </div>
            </div>
          </div>

          <div className="bkdet-section-card bkdet-timeline-card">
            <div className="bkdet-section-header">
              <div className="bkdet-section-title-wrap">
                <div className="bkdet-section-icon">
                  <i className="fas fa-stream" />
                </div>
                <h3 className="bkdet-section-title">Execution Updates & Status Log</h3>
              </div>
              <span className="bkdet-timeline-count-badge">
                {timelineItems.length} {timelineItems.length === 1 ? "Update" : "Updates"}
              </span>
            </div>

            <div className="bkdet-timeline-flow">
              {timelineItems.map((item, idx) => {
                const isLatest = idx === timelineItems.length - 1;
                const statusMeta = getStatusMeta(item.status);
                const formattedTime = new Date(item.timestamp).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div key={idx} className={`bkdet-tl-item ${isLatest ? "latest" : ""}`}>
                    <div className="bkdet-tl-left">
                      <div className={`bkdet-tl-bullet ${statusMeta.variant}`}>
                        <i className={statusMeta.icon} />
                      </div>
                      {idx < timelineItems.length - 1 && <div className="bkdet-tl-connector" />}
                    </div>

                    <div className="bkdet-tl-content">
                      <div className="bkdet-tl-meta-header">
                        <div className="bkdet-tl-title-group">
                          <span className={`bkdet-tl-status-pill ${statusMeta.variant}`}>
                            {statusMeta.label}
                          </span>
                          {isLatest && (
                            <span className="bkdet-live-badge">
                              <span className="bkdet-live-dot" />
                              Latest Update
                            </span>
                          )}
                        </div>
                        <span className="bkdet-tl-time">{formattedTime}</span>
                      </div>

                      {item.note && (
                        <div className="bkdet-tl-note-bubble">
                          <p className="bkdet-tl-note-text">{item.note}</p>
                          {item.authorName && (
                            <div className="bkdet-tl-author">
                              <i className="fas fa-user-check" />
                              <span>Shared by {item.authorName}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
                <div className="bkdet-meta-box-label">Service Warranty</div>
                <div className="bkdet-meta-box-value" style={{ color: "#16a34a", fontWeight: 600 }}>
                  15-Day Protection Active
                </div>
              </div>

              <div className="bkdet-meta-box">
                <div className="bkdet-meta-box-label">Pricing / Job Model</div>
                <div className="bkdet-meta-box-value">
                  {requiresInspection ? "Inspection Required" : "Fixed Price"}
                </div>
              </div>
            </div>

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
                <h3 className="bkdet-section-title">Payment & Billing</h3>
              </div>
              <div className="bkdet-header-pills-wrap">
                {!isFixedQuote && (
                  <span className={`bkdet-quote-type-tag ${isEstimatedQuote ? "type-estimated" : "type-inspection"}`}>
                    <i className={isEstimatedQuote ? "fas fa-calculator" : "fas fa-clipboard-check"} />
                    {isEstimatedQuote ? "Estimated Quote" : "Inspection Required"}
                  </span>
                )}
                <span
                  className={`bkdet-milestone-pill ${isCancelled || booking.paymentStatus === "REFUNDED"
                    ? "cancelled"
                    : isFixedQuote || isFullyPaid
                      ? "paid"
                      : isAdvancePaid
                        ? "pending"
                        : ""
                    }`}
                >
                  {isCancelled || booking.paymentStatus === "REFUNDED"
                    ? "100% Refunded"
                    : isFixedQuote
                      ? "100% Paid & Secured"
                      : isFullyPaid
                        ? "Fully Paid & Settled"
                        : isAdvancePaid
                          ? isInspectionQuote ? "Inspection Fee Secured" : "Advance Paid & Secured"
                          : "Pending"}
                </span>
              </div>
            </div>

            <div className="bkdet-price-wrapper">
              <span className="bkdet-price-sublabel">
                {isCancelled
                  ? "100% Refund Amount"
                  : isFixedQuote
                    ? "Total Fixed Amount Paid"
                    : (isPaymentPending || isCompleted)
                      ? "Final Confirmed Total"
                      : isInspectionQuote
                        ? "Inspection Fee Paid"
                        : "Initial Advance Paid"}
              </span>
              <div className="bkdet-price-huge">
                {formatCurrency((isPaymentPending || isCompleted || isFixedQuote) ? totalAmount : advanceAmount)}
              </div>
            </div>

            {isCancelled ? (
              <div className="bkdet-cancelled-tile">
                <div className="bkdet-fpt-icon" style={{ color: "#dc2626" }}>
                  <i className="fas fa-undo-alt" />
                </div>
                <div className="bkdet-fpt-content">
                  <span className="bkdet-fpt-title" style={{ color: "#991b1b" }}>100% Refund Processed</span>
                  <p className="bkdet-fpt-desc" style={{ color: "#b91c1c" }}>
                    The booking was cancelled before dispatch. The full payment of {formatCurrency(advanceAmount)} held in Escrow has been released back to the customer.
                  </p>
                </div>
              </div>
            ) : isFixedQuote ? (
              <div className="bkdet-fixed-paid-tile">
                <div className="bkdet-fpt-icon">
                  <i className="fas fa-check-circle" />
                </div>
                <div className="bkdet-fpt-content">
                  <span className="bkdet-fpt-title">Full Payment Secured in Escrow</span>
                  <p className="bkdet-fpt-desc">
                    The entire agreed amount of {formatCurrency(totalAmount)} was paid upfront upon booking. No additional balance or payments are due. Funds will be released to the provider upon completion.
                  </p>
                </div>
              </div>
            ) : (isPaymentPending || isCompleted) ? (
              <>
                <div className="bkdet-payment-grid-two">
                  <div className="bkdet-payment-tile paid">
                    <div className="bkdet-tile-header">
                      <span className="bkdet-tile-k">Initial Advance</span>
                      <span className="bkdet-milestone-pill paid">Paid (Advance)</span>
                    </div>
                    <div className="bkdet-tile-amount">{formatCurrency(advanceAmount)}</div>
                    <span className="bkdet-tile-desc">Paid online & held in Escrow</span>
                  </div>

                  <div className={`bkdet-payment-tile ${isFullyPaid ? "settled" : "due"}`}>
                    <div className="bkdet-tile-header">
                      <span className="bkdet-tile-k">Remaining Balance</span>
                      <span className={`bkdet-milestone-pill ${isFullyPaid ? "paid" : "warning"}`}>
                        {isFullyPaid ? "Settled" : "Due Now"}
                      </span>
                    </div>
                    <div className="bkdet-tile-amount">{formatCurrency(remainingAmount)}</div>
                    <span className="bkdet-tile-desc">
                      {isFullyPaid ? "Settled upon completion" : "Ready for customer payment"}
                    </span>
                  </div>
                </div>

                <div className="bkdet-calc-summary">
                  <div className="bkdet-calc-title">
                    <i className="fas fa-calculator" />
                    <span>Balance Calculation</span>
                  </div>
                  <div className="bkdet-calc-row">
                    <span>Final Confirmed Total</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="bkdet-calc-row advance">
                    <span>(-) Advance Paid Online</span>
                    <span>-{formatCurrency(advanceAmount)}</span>
                  </div>
                  <div className={`bkdet-calc-row balance ${isFullyPaid ? "settled" : ""}`}>
                    <span>
                      {isFullyPaid ? "(=) Balance Settled" : "(=) Remaining Balance Due Now"}
                    </span>
                    <span>{formatCurrency(remainingAmount)}</span>
                  </div>
                </div>

                <div className="bkdet-quote-type-notice confirmed">
                  <i className="fas fa-check-circle" />
                  <span>
                    {isInspectionQuote
                      ? "Final total confirmed by provider after on-site inspection."
                      : "Final total confirmed by provider upon job completion."}
                  </span>
                </div>
              </>
            ) : (
              <div className="bkdet-payment-grid-two">
                <div className="bkdet-payment-tile paid">
                  <div className="bkdet-tile-header">
                    <span className="bkdet-tile-k">
                      <i className="fas fa-check-circle" style={{ color: "#16a34a" }} />
                      {isInspectionQuote ? "Inspection Fee Paid" : "Initial Advance Paid"}
                    </span>
                    <span className="bkdet-milestone-pill paid">Paid Online</span>
                  </div>
                  <div className="bkdet-tile-amount">{formatCurrency(advanceAmount)}</div>
                  <span className="bkdet-tile-desc">Paid upfront & safely secured in Escrow</span>
                </div>

                <div className="bkdet-payment-tile pending">
                  <div className="bkdet-tile-header">
                    <span className="bkdet-tile-k">
                      <i className="fas fa-clock" style={{ color: "#d97706" }} />
                      Final Service Bill
                    </span>
                    <span className="bkdet-milestone-pill pending">Pending Quote</span>
                  </div>
                  <div className="bkdet-tile-amount pending-val">TBD On Site</div>
                  <span className="bkdet-tile-desc">
                    {isInspectionQuote
                      ? "Technician will diagnose on site and quote final total"
                      : "Provider will diagnose on site and quote final total"}
                  </span>
                </div>
              </div>
            )}

            <div className="bkdet-breakdown-card">
              <div className="bkdet-breakdown-header">
                <i className="fas fa-file-invoice-dollar" />
                <span>Price Details</span>
              </div>
              <div className="bkdet-breakdown-row">
                <span>
                  {isFixedQuote
                    ? "Base Service Quote"
                    : (isPaymentPending || isCompleted)
                      ? "Confirmed Service Amount"
                      : isInspectionQuote
                        ? "Inspection / Visit Fee"
                        : "Initial Base Quote"}
                </span>
                <span>{formatCurrency(baseAmount)}</span>
              </div>
              <div className="bkdet-breakdown-row">
                <span>Platform Fee (10%)</span>
                <span>+{formatCurrency(platformFee)}</span>
              </div>
              <div className="bkdet-breakdown-divider" />
              <div className="bkdet-breakdown-row total">
                <span>
                  {isFixedQuote
                    ? "Total Amount Paid"
                    : (isPaymentPending || isCompleted)
                      ? "Total Confirmed Amount"
                      : isInspectionQuote
                        ? "Total Inspection Fee Paid"
                        : "Total Advance Paid"}
                </span>
                <span>{formatCurrency((isPaymentPending || isCompleted || isFixedQuote) ? totalAmount : advanceAmount)}</span>
              </div>
            </div>

            {!isFixedQuote && !isProvider && isPaymentPending && (
              <div className="bkdet-pay-balance-action-box">
                <div className="bkdet-pba-text">
                  <strong>Ready to Pay Remaining Balance</strong>
                  <p>The provider completed the work and confirmed the total. Pay {formatCurrency(remainingAmount)} now to conclude this booking.</p>
                </div>
                <button
                  type="button"
                  className="bkdet-pay-balance-btn"
                  onClick={() =>
                    handleConfirmStatusChange(
                      booking,
                      "COMPLETED",
                      "Final balance payment confirmed by client. Escrow released."
                    )
                  }
                >
                  <i className="fas fa-credit-card" />
                  <span>Pay Remaining Balance ({formatCurrency(remainingAmount)})</span>
                </button>
              </div>
            )}

            {!isFixedQuote && !isProvider && !isPaymentPending && !isFullyPaid && (
              <div className="bkdet-pay-balance-info-box">
                <i className="fas fa-info-circle" />
                <span>
                  {isInspectionQuote
                    ? "The provider will perform the on-site inspection and confirm the final total before any balance is requested."
                    : "The provider will assess the job on site and confirm the final total before any balance is requested."}
                </span>
              </div>
            )}

            {!isFixedQuote && isFullyPaid && (
              <div className="bkdet-pay-balance-success-box">
                <i className="fas fa-check-circle" />
                <span>Full payment completed. Advance and final balance have been settled.</span>
              </div>
            )}

            {!isFixedQuote && isProvider && isPaymentPending && (
              <div className="bkdet-pay-balance-info-box warning">
                <i className="fas fa-clock" />
                <span>Awaiting customer settlement for remaining balance of {formatCurrency(remainingAmount)}.</span>
              </div>
            )}

            <div className="bkdet-escrow-badge">
              <i className="fas fa-shield-alt" />
              <div className="bkdet-escrow-badge-text">
                {isFixedQuote ? (
                  <><strong>100% Escrow Protection:</strong> Full payment of {formatCurrency(totalAmount)} is held safely in Escrow and released to the provider only after verified service completion.</>
                ) : (
                  <><strong>100% Escrow Protection:</strong> Advance deposit of {formatCurrency(advanceAmount)} is safely held in Escrow. Remaining balance will be settled only after final confirmation and completion.</>
                )}
              </div>
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
              </div>
            </div>

            <div className="bkdet-contact-actions">
              <button type="button" className="bkdet-contact-btn" onClick={handleChat}>
                <i className="fas fa-comment-dots" />
                <span>Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {(isProvider || (!isProvider && targetStatus === "CANCELLED")) && (
        <BookingStatusModal
          booking={statusModalBooking}
          targetStatus={targetStatus}
          isOpen={Boolean(statusModalBooking && targetStatus)}
          role={isProvider ? "PROVIDER" : "CUSTOMER"}
          onClose={handleCloseStatusModal}
          onConfirm={handleConfirmStatusChange}
          isLoading={updateStatusMutation.isPending}
        />
      )}
    </div>
  );
};
