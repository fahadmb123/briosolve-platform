import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import { RequestQuotations } from "../RequestQuotations/RequestQuotations";
import "./ServiceRequestDetailsView.css";

export interface ServiceRequestDetailsViewProps {
  role: "CUSTOMER" | "PROVIDER";
  request: CustomerServiceRequestItem | null;
  onBack: () => void;
  backLabel?: string;
  onEdit?: () => void;
  onCancel?: () => void;
  onReopen?: () => void;
  canEdit?: boolean;
  canCancel?: boolean;
  canReopen?: boolean;
  onQuote?: () => void;
  onViewQuotation?: () => void;
  onChat?: () => void;
  onQuotationAccepted?: () => void;
  distanceKm?: number | null;
  serviceRadiusKm?: number;
  isWithinRadius?: boolean;
}

export const ServiceRequestDetailsView: React.FC<ServiceRequestDetailsViewProps> = ({
  role,
  request,
  onBack,
  backLabel,
  onEdit,
  onCancel,
  onReopen,
  canEdit,
  canCancel,
  canReopen,
  onQuote,
  onViewQuotation,
  onChat,
  onQuotationAccepted,
  distanceKm,
  serviceRadiusKm = 20,
  isWithinRadius = true
}) => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const isRefundedBooking = Boolean(
    request?.latest_booking &&
    request.latest_booking.status === "CANCELLED" &&
    request.latest_booking.payment_status === "REFUNDED"
  );

  const address = request?.address_details;
  const fullAddressString = useMemo(() => {
    if (!address) return "Service address on file";
    return [
      address.house_no,
      address.landmark ? `Near ${address.landmark}` : null,
      address.area,
      address.city,
      address.district,
      address.state,
      address.pincode
    ]
      .filter(Boolean)
      .join(", ");
  }, [address]);

  const mapsUrl = useMemo(() => {
    if (address?.latitude && address?.longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressString)}`;
  }, [address, fullAddressString]);

  const copyRequestId = () => {
    if (!request) return;
    navigator.clipboard.writeText(request.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(fullAddressString);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  if (!request) {
    return (
      <div className="srdetails-page-container srdetails-sk-container" aria-hidden="true">
        <div className="srdetails-top-bar">
          <button type="button" className="srdetails-back-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i>
            <span>{backLabel || (role === "CUSTOMER" ? "Back to My Requests" : "Back to Service Requests")}</span>
          </button>
          <div className="srdetails-top-actions">
            <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "110px", height: "38px" }} />
          </div>
        </div>

        <div className="srdetails-hero-card">
          <div className="srdetails-hero-main">
            <div className="srdetails-badge-row">
              <div className="srdetails-shimmer srdetails-sk-badge-pill" style={{ width: "120px" }} />
              <div className="srdetails-shimmer srdetails-sk-badge-pill" style={{ width: "100px" }} />
              <div className="srdetails-shimmer srdetails-sk-badge-pill" style={{ width: "130px" }} />
            </div>
            <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "65%", height: "28px", margin: "14px 0 10px" }} />
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "140px", height: "15px" }} />
              <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "100px", height: "15px" }} />
            </div>
          </div>
          <div className="srdetails-hero-aside">
            <div className="srdetails-shimmer srdetails-sk-badge-pill" style={{ width: "110px", height: "30px", alignSelf: "flex-end" }} />
            <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "150px", height: "55px", marginTop: "10px", borderRadius: "10px" }} />
          </div>
        </div>

        <div className="srdetails-layout-grid">
          <div className="srdetails-main-column">
            <div className="srdetails-card">
              <div className="srdetails-card-header">
                <div className="srdetails-card-header-left">
                  <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "20px", height: "20px" }} />
                  <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "190px", height: "20px" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
                <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "100%", height: "14px" }} />
                <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "95%", height: "14px" }} />
                <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "70%", height: "14px" }} />
              </div>
              <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
                <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "100px", height: "100px", borderRadius: "10px" }} />
                <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "100px", height: "100px", borderRadius: "10px" }} />
              </div>
            </div>

            <div className="srdetails-card">
              <div className="srdetails-card-header">
                <div className="srdetails-card-header-left">
                  <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "20px", height: "20px" }} />
                  <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "160px", height: "20px" }} />
                </div>
                <div className="srdetails-shimmer srdetails-sk-badge-pill" style={{ width: "90px", height: "24px" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "14px" }}>
                <div className="srdetails-sk-quote-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <div className="srdetails-shimmer" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "120px", height: "14px" }} />
                        <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "80px", height: "12px" }} />
                      </div>
                    </div>
                    <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "90px", height: "24px" }} />
                  </div>
                </div>
                <div className="srdetails-sk-quote-box">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <div className="srdetails-shimmer" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "130px", height: "14px" }} />
                        <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "70px", height: "12px" }} />
                      </div>
                    </div>
                    <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "90px", height: "24px" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="srdetails-sidebar-column">
            <div className="srdetails-card">
              <div className="srdetails-card-header">
                <div className="srdetails-card-header-left">
                  <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "18px", height: "18px" }} />
                  <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "140px", height: "18px" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
                <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "85%", height: "18px" }} />
                <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "60%", height: "14px" }} />
              </div>
            </div>

            <div className="srdetails-card">
              <div className="srdetails-card-header">
                <div className="srdetails-card-header-left">
                  <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "18px", height: "18px" }} />
                  <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "130px", height: "18px" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
                <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "90%", height: "15px" }} />
                <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "70%", height: "14px" }} />
                <div className="srdetails-shimmer srdetails-sk-line" style={{ width: "100%", height: "130px", borderRadius: "8px", marginTop: "6px" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const customer = request.customer_details;
  const customerInitial = (customer?.name || "Customer").charAt(0).toUpperCase();

  const formattedPostedDate = new Date(request.created_at).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const getUrgencyBadge = () => {
    if (request.status === "EXPIRED") {
      return <span className="srdetails-badge date">Expired</span>;
    }
    if (request.specific_date) {
      const d = new Date(request.specific_date).toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      return <span className="srdetails-badge timing"><i className="far fa-calendar-alt"></i> Date: {d}</span>;
    }
    switch (request.urgency) {
      case "TODAY":
        return <span className="srdetails-badge urgent"><i className="fas fa-bolt"></i> Urgent • Today</span>;
      case "THIS_WEEK":
        return <span className="srdetails-badge timing"><i className="far fa-clock"></i> Within This Week</span>;
      case "FLEXIBLE":
        return <span className="srdetails-badge date"><i className="far fa-calendar"></i> Flexible Schedule</span>;
      default:
        return <span className="srdetails-badge date">{request.urgency}</span>;
    }
  };

  const getStatusPill = () => {
    if (role === "PROVIDER") {
      if (request.status === "CANCELLED") {
        return (
          <span className="srdetails-status-pill cancelled">
            <i className="fas fa-ban"></i> Request Cancelled
          </span>
        );
      }
      if (request.status === "EXPIRED") {
        return (
          <span className="srdetails-status-pill expired">
            <i className="fas fa-clock"></i> Expired
          </span>
        );
      }
      if (request.status === "ACCEPTED") {
        return (
          <span className="srdetails-status-pill completed">
            <i className="fas fa-check-circle"></i> Quotation Accepted
          </span>
        );
      }
      return (
        <span className="srdetails-status-pill open">
          <i className="fas fa-circle text-xs"></i> Open for Quotations
        </span>
      );
    }

    switch (request.status) {
      case "ACTIVE":
        return (
          <span className="srdetails-status-pill active">
            <i className="fas fa-circle text-xs"></i> Active
          </span>
        );
      case "PENDING":
        return (
          <span className="srdetails-status-pill pending">
            <i className="fas fa-clock"></i> Pending
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="srdetails-status-pill completed">
            <i className="fas fa-check-circle"></i> Quotation Accepted
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="srdetails-status-pill in-progress">
            <i className="fas fa-tools"></i> In Progress
          </span>
        );
      case "COMPLETED":
        return (
          <span className="srdetails-status-pill completed">
            <i className="fas fa-check-circle"></i> Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="srdetails-status-pill cancelled">
            <i className="fas fa-ban"></i> Cancelled
          </span>
        );
      case "EXPIRED":
        if (isRefundedBooking) {
          return (
            <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
              <span className="srdetails-status-pill expired">
                <i className="fas fa-clock"></i> Expired
              </span>
              <span className="srdetails-status-pill" style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" }}>
                <i className="fas fa-undo-alt"></i> 100% Refunded
              </span>
            </div>
          );
        }
        return (
          <span className="srdetails-status-pill expired">
            <i className="fas fa-clock"></i> Expired
          </span>
        );
      default:
        return (
          <span className="srdetails-status-pill active">
            {request.status.replace("_", " ")}
          </span>
        );
    }
  };

  const quotesCount = request.quotations_count ?? 0;
  const notifiedCount = request.matched_providers_count ?? 0;

  return (
    <div className="srdetails-page-container">
      <div className="srdetails-top-bar">
        <button type="button" className="srdetails-back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          <span>{backLabel || (role === "CUSTOMER" ? "Back to My Requests" : "Back to Service Requests")}</span>
        </button>

        <div className="srdetails-top-actions">
          {role === "CUSTOMER" && (
            <>
              {canEdit && request.status !== "EXPIRED" && request.status !== "ACCEPTED" && onEdit && (
                <button
                  type="button"
                  className="srdetails-btn-edit-top"
                  onClick={onEdit}
                >
                  <i className="fas fa-pen"></i>
                  <span>Edit Details</span>
                </button>
              )}

              {canCancel && onCancel && (
                <button
                  type="button"
                  className="srdetails-btn-cancel-top"
                  onClick={onCancel}
                >
                  <i className="fas fa-times"></i>
                  <span>Cancel Request</span>
                </button>
              )}

              {canReopen && onReopen && (
                <button
                  type="button"
                  className="srdetails-btn-reopen-top"
                  onClick={onReopen}
                >
                  <i className="fas fa-sync-alt"></i>
                  <span>Reopen Request</span>
                </button>
              )}
            </>
          )}

          {role === "PROVIDER" && (
            <>
              {request.status !== "CANCELLED" && onChat && (
                <button
                  type="button"
                  className="srdetails-btn-chat-top"
                  onClick={onChat}
                  title="Message the customer directly"
                >
                  <i className="fas fa-comment-dots"></i>
                  <span>Chat with Customer</span>
                </button>
              )}

              {request.has_quoted && onViewQuotation ? (
                <button
                  type="button"
                  className="srdetails-btn-quoted-top"
                  onClick={onViewQuotation}
                >
                  <i className="fas fa-check-circle"></i>
                  <span>View Submitted Quotation</span>
                </button>
              ) : request.status !== "CANCELLED" && request.status !== "EXPIRED" && onQuote ? (
                <button
                  type="button"
                  className="srdetails-btn-quote-top"
                  onClick={onQuote}
                >
                  <i className="fas fa-paper-plane"></i>
                  <span>Submit Quotation</span>
                </button>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div className="srdetails-hero-card">
        <div className="srdetails-hero-main">
          <div className="srdetails-badge-row">
            <span className="srdetails-badge category">
              <i className="fas fa-tag"></i>
              {request.category_name || "General Service"}
            </span>

            {request.subservice_name && (
              <span className="srdetails-badge subservice">
                {request.subservice_name}
              </span>
            )}

            {getUrgencyBadge()}

            <span className="srdetails-badge date">
              <i className="far fa-calendar"></i> Posted {formattedPostedDate}
            </span>
          </div>

          <h1 className="srdetails-hero-title">{request.title}</h1>

          <div className="srdetails-id-copy-row">
            <span>Request ID: <strong>{request.id.slice(0, 14)}...</strong></span>
            <button
              type="button"
              className="srdetails-btn-copy-id"
              onClick={copyRequestId}
              title="Copy full Request ID"
            >
              <i className={`fas ${copiedId ? "fa-check text-success" : "fa-copy"}`}></i>
              <span>{copiedId ? "Copied" : "Copy ID"}</span>
            </button>
          </div>
        </div>

        <div className="srdetails-hero-status-box">
          {getStatusPill()}
        </div>
      </div>

      <div className="srdetails-layout-grid">
        <div className="srdetails-main-column">
          {isRefundedBooking && (
            <div className="srdetails-refund-alert-box">
              <div className="srdetails-refund-alert-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="srdetails-refund-alert-body">
                <div className="srdetails-refund-alert-header">
                  <span className="srdetails-refund-badge">100% ESCROW REFUND ISSUED</span>
                  {request?.latest_booking?.booking_number && (
                    <span className="srdetails-refund-booking-ref">
                      Booking #{request.latest_booking.booking_number}
                    </span>
                  )}
                </div>
                <h3 className="srdetails-refund-heading">
                  Technician cancelled before dispatch. Your payment has been 100% refunded.
                </h3>
                <p className="srdetails-refund-subtext">
                  {request?.latest_booking?.cancellation_reason
                    ? `Reason: "${request.latest_booking.cancellation_reason}". `
                    : ""}
                  Your advance deposit of ₹{(request?.latest_booking?.advance_amount || 0).toLocaleString("en-IN")} held safely in Escrow has been refunded to your original payment method. You can now reopen this request to receive quotes from other verified providers.
                </p>
                <div className="srdetails-refund-action-row">
                  {canReopen && onReopen && (
                    <button
                      type="button"
                      className="srdetails-btn-refund-reopen"
                      onClick={onReopen}
                    >
                      <i className="fas fa-sync-alt"></i>
                      <span>Reopen Request for Other Quotes</span>
                    </button>
                  )}
                  {request?.latest_booking?.id && (
                    <button
                      type="button"
                      className="srdetails-btn-refund-receipt"
                      onClick={() => navigate(`/bookings/${request.latest_booking?.id}`)}
                    >
                      <i className="fas fa-receipt"></i>
                      <span>View Refund Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="srdetails-card">
            <div className="srdetails-card-header">
              <div className="srdetails-card-header-left">
                <i className="fas fa-align-left srdetails-card-icon"></i>
                <h3 className="srdetails-card-title">Requirement Description & Scope</h3>
              </div>
            </div>
            <p className="srdetails-description-text">{request.description}</p>
          </div>

          {request.answers && request.answers.length > 0 && (
            <div className="srdetails-card">
              <div className="srdetails-card-header">
                <div className="srdetails-card-header-left">
                  <i className="fas fa-clipboard-list srdetails-card-icon"></i>
                  <h3 className="srdetails-card-title">Service Specifications</h3>
                </div>
              </div>
              <div className="srdetails-specs-grid">
                {request.answers.map((ans, idx) => (
                  <div key={ans.question_id || idx} className="srdetails-spec-item">
                    <span className="srdetails-spec-label">{ans.question_label}</span>
                    <span className="srdetails-spec-value">
                      {Array.isArray(ans.answer)
                        ? ans.answer.join(", ")
                        : typeof ans.answer === "boolean"
                        ? ans.answer ? "Yes" : "No"
                        : String(ans.answer ?? "—")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="srdetails-card">
            <div className="srdetails-card-header">
              <div className="srdetails-card-header-left">
                <i className="far fa-clock srdetails-card-icon"></i>
                <h3 className="srdetails-card-title">Schedule & Operating Hours</h3>
              </div>
            </div>
            <div className="srdetails-timing-rows">
              <div className="srdetails-timing-row">
                <span className="srdetails-timing-label">Preferred Time Window</span>
                <span className="srdetails-timing-value">
                  {request.available_time_from && request.available_time_to
                    ? `${request.available_time_from.slice(0, 5)} - ${request.available_time_to.slice(0, 5)}`
                    : "Flexible operating hours"}
                </span>
              </div>
              {request.specific_date && (
                <div className="srdetails-timing-row">
                  <span className="srdetails-timing-label">Target Date</span>
                  <span className="srdetails-timing-value">
                    {new Date(request.specific_date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {(request.budget_type || request.budget_amount) && (
            <div className="srdetails-card">
              <div className="srdetails-card-header">
                <div className="srdetails-card-header-left">
                  <i className="fas fa-wallet srdetails-card-icon"></i>
                  <h3 className="srdetails-card-title">Estimated Budget</h3>
                </div>
              </div>
              <div className="srdetails-budget-rows">
                <div className="srdetails-budget-row">
                  <span className="srdetails-timing-label">Expected Amount</span>
                  <span className="srdetails-budget-amount-highlight">
                    {request.budget_amount ? `₹${request.budget_amount.toLocaleString("en-IN")}` : "Flexible"}
                  </span>
                </div>
                {request.budget_type && (
                  <div className="srdetails-budget-row">
                    <span className="srdetails-timing-label">Budget Type</span>
                    <span className="srdetails-timing-value">{request.budget_type}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {request.images && request.images.length > 0 && (
            <div className="srdetails-card">
              <div className="srdetails-card-header">
                <div className="srdetails-card-header-left">
                  <i className="fas fa-camera srdetails-card-icon"></i>
                  <h3 className="srdetails-card-title">
                    Attached Requirement Photos ({request.images.length})
                  </h3>
                </div>
              </div>
              <div className="srdetails-gallery-grid">
                {request.images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="srdetails-photo-box"
                    onClick={() => setLightboxPhoto(img.image_key)}
                    title="Click to view full photo"
                  >
                    <img src={img.image_key} alt={`Attached requirement ${idx + 1}`} />
                    <div className="srdetails-photo-overlay">
                      <i className="fas fa-search-plus"></i>
                      <span>Inspect</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {role === "CUSTOMER" && request.id && (
            <RequestQuotations
              requestId={request.id}
              requestStatus={request.status}
              requestItem={request}
              onQuotationAccepted={onQuotationAccepted}
            />
          )}
        </div>

        <div className="srdetails-sidebar-column">
          {role === "PROVIDER" && (
            <div className="srdetails-card srdetails-customer-card">
              <div className="srdetails-customer-header">
                {customer?.profile_image ? (
                  <img
                    src={customer.profile_image}
                    alt={customer.name}
                    className="srdetails-customer-avatar"
                  />
                ) : (
                  <div className="srdetails-customer-avatar-fallback">
                    {customerInitial}
                  </div>
                )}
                <div className="srdetails-customer-names">
                  <span className="srdetails-customer-name">{customer?.name || "Customer"}</span>
                  <span className="srdetails-customer-tag">
                    <i className="fas fa-check-circle"></i> Verified Customer
                  </span>
                </div>
              </div>

              <div className="srdetails-customer-contact-list">
                {customer?.phone && (
                  <a href={`tel:${customer.phone}`} className="srdetails-contact-chip">
                    <i className="fas fa-phone-alt"></i>
                    <span>{customer.phone}</span>
                  </a>
                )}
                {customer?.email && (
                  <a href={`mailto:${customer.email}`} className="srdetails-contact-chip">
                    <i className="fas fa-envelope"></i>
                    <span>{customer.email}</span>
                  </a>
                )}
              </div>

              {request.status !== "CANCELLED" && onChat && (
                <button
                  type="button"
                  className="srdetails-btn-chat-primary"
                  onClick={onChat}
                >
                  <i className="fas fa-comment-dots"></i>
                  <span>Message Customer</span>
                </button>
              )}
            </div>
          )}

          {role === "CUSTOMER" && (
            <div className="srdetails-card">
              <div className="srdetails-card-header">
                <div className="srdetails-card-header-left">
                  <i className="fas fa-bolt srdetails-card-icon"></i>
                  <h3 className="srdetails-card-title">Marketplace Activity</h3>
                </div>
              </div>

              <div className="srdetails-activity-list">
                <div className="srdetails-activity-item">
                  <div className="srdetails-activity-item-left">
                    <i className="fas fa-file-invoice"></i>
                    <span>Quotations Received</span>
                  </div>
                  <span className="srdetails-activity-badge">{quotesCount}</span>
                </div>

                <div className="srdetails-activity-item">
                  <div className="srdetails-activity-item-left">
                    <i className="fas fa-user-friends"></i>
                    <span>Providers Notified</span>
                  </div>
                  <span className="srdetails-activity-badge">{notifiedCount}</span>
                </div>
              </div>
            </div>
          )}

          <div className="srdetails-card">
            <div className="srdetails-card-header">
              <div className="srdetails-card-header-left">
                <i className="fas fa-map-marker-alt srdetails-card-icon"></i>
                <h3 className="srdetails-card-title">
                  {role === "PROVIDER" ? "Location & Distance" : "Service Location"}
                </h3>
              </div>
            </div>

            {role === "PROVIDER" && distanceKm !== undefined && (
              <div className={`srdetails-distance-banner ${isWithinRadius ? "in-radius" : "out-radius"}`}>
                <i className="fas fa-location-arrow srdetails-distance-icon"></i>
                <div className="srdetails-distance-text-block">
                  <span className="srdetails-distance-heading">
                    {distanceKm !== null ? `${distanceKm < 1 ? "< 1 km away" : `${distanceKm.toFixed(1)} km away`}` : "Distance based on dispatch"}
                  </span>
                  <span className="srdetails-distance-sub">
                    {isWithinRadius
                      ? `Within your ${serviceRadiusKm} km coverage`
                      : `Beyond your ${serviceRadiusKm} km coverage`}
                  </span>
                </div>
              </div>
            )}

            <div className="srdetails-address-grid">
              <div className="srdetails-address-row">
                <span className="srdetails-address-label">Building / House</span>
                <span className="srdetails-address-val">{address?.house_no || "—"}</span>
              </div>
              <div className="srdetails-address-row">
                <span className="srdetails-address-label">Area / Street</span>
                <span className="srdetails-address-val">{address?.area || "—"}</span>
              </div>
              {address?.landmark && (
                <div className="srdetails-address-row">
                  <span className="srdetails-address-label">Landmark</span>
                  <span className="srdetails-address-val">{address.landmark}</span>
                </div>
              )}
              <div className="srdetails-address-row">
                <span className="srdetails-address-label">City</span>
                <span className="srdetails-address-val">{address?.city || "—"}</span>
              </div>
              <div className="srdetails-address-row">
                <span className="srdetails-address-label">District & State</span>
                <span className="srdetails-address-val">
                  {[address?.district, address?.state].filter(Boolean).join(", ") || "—"}
                </span>
              </div>
              {address?.pincode && (
                <div className="srdetails-address-row">
                  <span className="srdetails-address-label">PIN Code</span>
                  <span className="srdetails-address-val">{address.pincode}</span>
                </div>
              )}
            </div>

            <div className="srdetails-address-actions">
              <button
                type="button"
                className="srdetails-btn-action-outline"
                onClick={copyAddress}
                title="Copy full address"
              >
                <i className={`fas ${copiedAddress ? "fa-check text-success" : "fa-copy"}`}></i>
                <span>{copiedAddress ? "Copied" : "Copy Address"}</span>
              </button>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="srdetails-btn-action-outline"
                title="Open in Google Maps"
              >
                <i className="fas fa-map-marked-alt"></i>
                <span>Google Maps</span>
              </a>
            </div>
          </div>

          {role === "PROVIDER" && (
            <div className="srdetails-action-cta-card">
              {request.status === "CANCELLED" ? (
                <>
                  <h4 className="srdetails-cta-title">Request Cancelled</h4>
                  <p className="srdetails-cta-sub">
                    The customer has cancelled this service request. No further quotations can be submitted.
                  </p>
                </>
              ) : request.status === "EXPIRED" ? (
                <>
                  <h4 className="srdetails-cta-title">Request Expired</h4>
                  <p className="srdetails-cta-sub">
                    This request has passed its validity window and is closed for new quotations.
                  </p>
                </>
              ) : request.status === "ACCEPTED" ? (
                <>
                  <h4 className="srdetails-cta-title">Job Awarded</h4>
                  <p className="srdetails-cta-sub">
                    A quotation has been accepted for this service request.
                  </p>
                  {onViewQuotation && (
                    <button
                      type="button"
                      className="srdetails-btn-quoted-cta"
                      onClick={onViewQuotation}
                    >
                      <i className="fas fa-file-invoice-dollar"></i>
                      <span>Manage My Quotations</span>
                    </button>
                  )}
                </>
              ) : request.has_quoted ? (
                <>
                  <div className="srdetails-quoted-box">
                    <i className="fas fa-check-circle srdetails-quoted-icon"></i>
                    <div className="srdetails-quoted-text">
                      <h5>Quotation Submitted</h5>
                      <p>You have already submitted a proposal for this request.</p>
                    </div>
                  </div>
                  {onViewQuotation && (
                    <button
                      type="button"
                      className="srdetails-btn-quoted-cta"
                      onClick={onViewQuotation}
                    >
                      <i className="fas fa-file-invoice-dollar"></i>
                      <span>Manage My Quotations</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <h4 className="srdetails-cta-title">Ready to take this job?</h4>
                  <p className="srdetails-cta-sub">
                    Submit a transparent quote with your price, scope, deliverables, and schedule to win this customer.
                  </p>
                  {onQuote && (
                    <button
                      type="button"
                      className="srdetails-btn-cta-primary"
                      onClick={onQuote}
                    >
                      <i className="fas fa-paper-plane"></i>
                      <span>Submit Quotation</span>
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {role === "CUSTOMER" && (
            <div className="srdetails-action-cta-card">
              {request.status === "CANCELLED" ? (
                <>
                  <h4 className="srdetails-cta-title">Request Cancelled</h4>
                  <p className="srdetails-cta-sub">
                    This service request has been cancelled. Providers can no longer submit quotations.
                  </p>
                  {canReopen && onReopen && (
                    <button
                      type="button"
                      className="srdetails-btn-cta-primary"
                      onClick={onReopen}
                    >
                      <i className="fas fa-sync-alt"></i>
                      <span>Reopen Request</span>
                    </button>
                  )}
                </>
              ) : request.status === "EXPIRED" ? (
                <>
                  <h4 className="srdetails-cta-title" style={isRefundedBooking ? { color: "#065f46" } : undefined}>
                    {isRefundedBooking ? "Booking Cancelled & Refunded" : "Request Expired"}
                  </h4>
                  <p className="srdetails-cta-sub">
                    {isRefundedBooking
                      ? "The technician cancelled before travelling. Your payment was 100% refunded. Reopen this request to get new quotes."
                      : "This request passed its required service date. You can reopen it with an updated timeline."}
                  </p>
                  {canReopen && onReopen && (
                    <button
                      type="button"
                      className="srdetails-btn-cta-primary"
                      onClick={onReopen}
                    >
                      <i className="fas fa-sync-alt"></i>
                      <span>{isRefundedBooking ? "Reopen for Other Quotes" : "Reopen Request"}</span>
                    </button>
                  )}
                </>
              ) : request.status === "ACCEPTED" ? (
                <>
                  <h4 className="srdetails-cta-title">Quotation Accepted</h4>
                  <p className="srdetails-cta-sub">
                    You have accepted a quotation and secured the booking for this service request.
                  </p>
                  <div className="srdetails-quoted-box">
                    <i className="fas fa-check-circle srdetails-quoted-icon"></i>
                    <div className="srdetails-quoted-text">
                      <h5>Booking Confirmed</h5>
                      <p>Editing is locked because a provider has been booked for this job.</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="srdetails-cta-title">Manage Your Request</h4>
                  <p className="srdetails-cta-sub">
                    You can update specifications or cancel your requirement before accepting a quotation.
                  </p>
                  {canEdit && onEdit && (
                    <button
                      type="button"
                      className="srdetails-btn-cta-secondary"
                      onClick={onEdit}
                    >
                      <i className="fas fa-pen"></i>
                      <span>Edit Requirement</span>
                    </button>
                  )}
                  {canCancel && onCancel && (
                    <button
                      type="button"
                      className="srdetails-btn-cta-danger"
                      onClick={onCancel}
                    >
                      <i className="fas fa-times"></i>
                      <span>Cancel Requirement</span>
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {lightboxPhoto && (
        <div
          className="srdetails-lightbox-backdrop"
          onClick={() => setLightboxPhoto(null)}
        >
          <div
            className="srdetails-lightbox-container"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxPhoto}
              alt="Requirement preview"
              className="srdetails-lightbox-image"
            />
            <button
              type="button"
              className="srdetails-lightbox-close-btn"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
