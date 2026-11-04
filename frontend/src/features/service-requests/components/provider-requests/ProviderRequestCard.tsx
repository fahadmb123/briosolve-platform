import type { FC } from "react";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";

interface ProviderRequestCardProps {
  request: CustomerServiceRequestItem;
  onViewDetails: (request: CustomerServiceRequestItem) => void;
  onSelectPhoto: (photoUrl: string) => void;
  onQuote: (request: CustomerServiceRequestItem) => void;
  onChat?: (request: CustomerServiceRequestItem) => void;
}

export const ProviderRequestCard: FC<ProviderRequestCardProps> = ({
  request,
  onViewDetails,
  onSelectPhoto,
  onQuote,
  onChat,
}) => {
  const getUrgencyBadge = () => {
    switch (request.urgency) {
      case "TODAY":
        return { label: "Needed Today", className: "urgent-today" };
      case "THIS_WEEK":
        return { label: "This Week", className: "urgent-week" };
      case "SPECIFIC_DATE": {
        const dateStr = request.specific_date
          ? new Date(request.specific_date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })
          : "Scheduled";
        return { label: `By ${dateStr}`, className: "urgent-date" };
      }
      case "FLEXIBLE":
      default:
        return { label: "Flexible Schedule", className: "urgent-flexible" };
    }
  };

  const addressText = request.address_details
    ? `${request.address_details.area}, ${request.address_details.city}`
    : "Local client";

  const formattedDate = new Date(request.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  const urgencyInfo = getUrgencyBadge();
  const quotationsCount = request.quotations_count ?? 0;

  return (
    <div className="provreq-clean-card">
      <div className="provreq-card-top-row">
        <div className="provreq-category-crumbs">
          <i className="fas fa-layer-group provreq-crumb-icon"></i>
          <span className="provreq-category-name">{request.category_name || "General Service"}</span>
          {request.subservice_name && (
            <>
              <span className="provreq-crumb-separator">/</span>
              <span className="provreq-subservice-name">{request.subservice_name}</span>
            </>
          )}
        </div>

        <div className={`provreq-urgency-pill ${urgencyInfo.className}`}>
          <i className="far fa-clock"></i>
          <span>{urgencyInfo.label}</span>
        </div>
      </div>

      <div className="provreq-card-body">
        <h3
          className="provreq-card-headline"
          onClick={() => onViewDetails(request)}
          title="Click to view details"
        >
          {request.title}
        </h3>
        <p className="provreq-card-description">{request.description}</p>

        <div className="provreq-meta-grid">
          <div className="provreq-meta-chip" title="Location">
            <i className="fas fa-map-marker-alt"></i>
            <span className="provreq-meta-text-truncate">{addressText}</span>
          </div>

          <div className="provreq-meta-chip" title="Available time slot">
            <i className="far fa-calendar-check"></i>
            <span>
              {request.available_time_from?.slice(0, 5) || "09:00"} - {request.available_time_to?.slice(0, 5) || "17:00"}
            </span>
          </div>

          <div className="provreq-meta-chip budget" title="Client budget">
            <i className="fas fa-wallet"></i>
            <span>
              {request.budget_type === "FIXED" && request.budget_amount
                ? `₹${request.budget_amount.toLocaleString()}`
                : "Open to Bids"}
            </span>
          </div>

          <div className="provreq-meta-chip" title="Quotations received">
            <i className="fas fa-comment-dollar"></i>
            <span>
              {quotationsCount === 0 ? "Be 1st to Quote" : `${quotationsCount} Quote${quotationsCount > 1 ? "s" : ""}`}
            </span>
          </div>
        </div>

        {request.images && request.images.length > 0 && (
          <div className="provreq-photos-strip">
            {request.images.slice(0, 4).map((img, idx) => (
              <div
                key={img.id || idx}
                className="provreq-photo-thumb-wrapper"
                onClick={() => onSelectPhoto(img.image_key)}
                title="Click to view full image"
              >
                <img
                  src={img.image_key}
                  alt={`Attachment ${idx + 1}`}
                  className="provreq-photo-item"
                />
                <div className="provreq-photo-hover-indicator">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
            ))}
            {request.images.length > 4 && (
              <span
                className="provreq-photos-overflow"
                onClick={() => onViewDetails(request)}
                title="View all attached photos"
              >
                +{request.images.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="provreq-card-bottom-row">
        <div className="provreq-footer-meta">
          <span className="provreq-post-date">
            <i className="far fa-calendar mr-1"></i> Posted {formattedDate}
          </span>
          {request.status === "CANCELLED" ? (
            <span className="provreq-status-dot-cancelled">
              <span className="provreq-dot-cancelled"></span>
              Cancelled
            </span>
          ) : (
            <span className="provreq-status-dot-active">
              <span className="provreq-pulse-dot"></span>
              Open for Quotes
            </span>
          )}
        </div>

        <div className="provreq-card-actions">
          <button
            type="button"
            className="provreq-btn-details"
            onClick={() => onViewDetails(request)}
          >
            <i className="far fa-eye"></i>
            <span>View Scope</span>
          </button>

          {request.status !== "CANCELLED" && onChat && (
            <button
              type="button"
              className="provreq-btn-chat-card"
              onClick={() => onChat(request)}
              title="Chat with Customer"
            >
              <i className="fas fa-comment-dots"></i>
              <span>Chat</span>
            </button>
          )}

          {request.status === "CANCELLED" ? (
            <button
              type="button"
              className="provreq-btn-quote disabled"
              disabled
              title="This request has been cancelled by the customer"
            >
              <i className="fas fa-ban"></i>
              <span>Cancelled</span>
            </button>
          ) : (
            <button
              type="button"
              className="provreq-btn-quote"
              onClick={() => onQuote(request)}
            >
              <i className="fas fa-paper-plane"></i>
              <span>Send Quote</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
