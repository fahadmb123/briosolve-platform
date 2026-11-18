import { useState, type FC } from "react";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { calculateDistanceKm, formatDistance } from "../../utils/distance.utils";
import { getCategoryVisualConfig } from "../../utils/categoryIcon.utils";

interface ProviderRequestCardProps {
  request: CustomerServiceRequestItem;
  onViewDetails: (request: CustomerServiceRequestItem) => void;
  onSelectPhoto: (photoUrl: string) => void;
  onQuote: (request: CustomerServiceRequestItem) => void;
  onViewQuotation?: (request: CustomerServiceRequestItem) => void;
  onChat?: (request: CustomerServiceRequestItem) => void;
}

export const ProviderRequestCard: FC<ProviderRequestCardProps> = ({
  request,
  onViewDetails,
  onSelectPhoto,
  onQuote,
  onViewQuotation,
  onChat,
}) => {
  const [imageError, setImageError] = useState(false);
  const user = useAuthStore((state) => state.user);
  const providerAddress = user?.current_address_id;
  const providerLat = providerAddress?.latitude != null ? Number(providerAddress.latitude) : null;
  const providerLng = providerAddress?.longitude != null ? Number(providerAddress.longitude) : null;

  const reqLat = request.address_details?.latitude != null ? Number(request.address_details.latitude) : null;
  const reqLng = request.address_details?.longitude != null ? Number(request.address_details.longitude) : null;

  const computedDistance =
    request.distance_km ??
    (providerLat != null && providerLng != null && reqLat != null && reqLng != null
      ? calculateDistanceKm(providerLat, providerLng, reqLat, reqLng)
      : null);

  const formattedDist = formatDistance(computedDistance);
  const visual = getCategoryVisualConfig(request.category_name, request.subservice_name);

  const getUrgencyText = () => {
    if (request.status === "EXPIRED") {
      return "Expired";
    }
    if (request.specific_date) {
      const dateStr = new Date(request.specific_date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      return `Required by: ${dateStr}`;
    }
    switch (request.urgency) {
      case "TODAY":
        return "Required: Today";
      case "THIS_WEEK":
        return "Required: This Week";
      case "FLEXIBLE":
      default:
        return "Schedule: Flexible";
    }
  };

  const addressText = request.address_details
    ? `${request.address_details.area || ""}, ${request.address_details.city || ""}`.trim().replace(/^,|,$/g, "")
    : "Local client";

  const formattedDate = new Date(request.created_at).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const quotationsCount = request.quotations_count ?? 0;
  const isCancelled = request.status === "CANCELLED";
  const isExpired = request.status === "EXPIRED";

  const renderStatusBadge = () => {
    switch (request.status) {
      case "CANCELLED":
        return (
          <span className="provreq-badge-pill provreq-badge-cancelled">
            <span className="provreq-dot-indicator"></span>
            <span>Cancelled</span>
          </span>
        );
      case "EXPIRED":
        return (
          <span className="provreq-badge-pill provreq-badge-expired">
            <span className="provreq-dot-indicator"></span>
            <span>Expired</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="provreq-badge-pill provreq-badge-completed">
            <span className="provreq-dot-indicator"></span>
            <span>Completed</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="provreq-badge-pill provreq-badge-progress">
            <span className="provreq-dot-indicator"></span>
            <span>In Progress</span>
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="provreq-badge-pill provreq-badge-accepted">
            <span className="provreq-dot-indicator"></span>
            <span>Accepted</span>
          </span>
        );
      case "ACTIVE":
        return (
          <span className="provreq-badge-pill provreq-badge-active">
            <span className="provreq-dot-indicator"></span>
            <span>Active</span>
          </span>
        );
      default:
        return (
          <span className="provreq-badge-pill provreq-badge-open">
            <span className="provreq-dot-indicator"></span>
            <span>Open Request</span>
          </span>
        );
    }
  };

  const attachedPhoto = request.images && request.images.length > 0 ? request.images[0].image_key : null;
  const serviceImageUrl = request.subservice_image || request.category_image || attachedPhoto;
  const showServiceImage = Boolean(serviceImageUrl && !imageError);

  return (
    <div className="provreq-row-card">
      <div className="provreq-card-header">
        <div className="provreq-header-left">
          {showServiceImage ? (
            <div
              className="provreq-category-avatar has-image"
              onClick={() => onViewDetails(request)}
              title={request.subservice_name || request.category_name || "Service"}
            >
              <img
                src={serviceImageUrl!}
                alt={request.subservice_name || request.category_name || "Service"}
                className="provreq-avatar-img"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div
              className="provreq-category-avatar"
              style={{ backgroundColor: visual.bgColor, color: visual.textColor }}
              aria-hidden="true"
            >
              <i className={visual.icon}></i>
            </div>
          )}

          <div className="provreq-row-breadcrumbs">
            <span className="provreq-crumb-category">{request.category_name || "General Service"}</span>
            {request.subservice_name && (
              <>
                <span className="provreq-crumb-sep">/</span>
                <span className="provreq-crumb-sub">{request.subservice_name}</span>
              </>
            )}
            <span className="provreq-crumb-bullet">•</span>
            <span className="provreq-crumb-date">Posted {formattedDate}</span>
          </div>
        </div>

        <div className="provreq-header-right">
          {renderStatusBadge()}
        </div>
      </div>

      <div className="provreq-card-body">
        <h3 className="provreq-row-title" onClick={() => onViewDetails(request)}>
          {request.title}
        </h3>

        <p className="provreq-row-desc">{request.description}</p>

        <div className="provreq-row-meta">
          <div className="provreq-meta-tag">
            <i className="far fa-calendar-alt"></i>
            <span>{getUrgencyText()}</span>
          </div>

          <div className="provreq-meta-tag">
            <i className="far fa-clock"></i>
            <span>
              {request.available_time_from?.slice(0, 5) || "09:00"} - {request.available_time_to?.slice(0, 5) || "17:00"}
            </span>
          </div>

          <div className="provreq-meta-tag location">
            <i className="fas fa-map-marker-alt"></i>
            <span className="provreq-meta-location-text">{addressText}</span>
          </div>

          {formattedDist && (
            <div className="provreq-meta-tag distance">
              <i className="fas fa-location-arrow"></i>
              <span>{formattedDist} away</span>
            </div>
          )}

          {request.customer_details?.name && (
            <div className="provreq-meta-tag customer">
              <i className="far fa-user"></i>
              <span>{request.customer_details.name}</span>
            </div>
          )}

          {quotationsCount > 0 ? (
            <div className="provreq-meta-tag quotes-count">
              <i className="far fa-file-alt"></i>
              <span>{quotationsCount} {quotationsCount === 1 ? "Quote Submitted" : "Quotes Submitted"}</span>
            </div>
          ) : null}

          {request.has_quoted ? (
            <div className="provreq-meta-tag has-quoted">
              <i className="fas fa-check-circle"></i>
              <span>You Quoted</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="provreq-card-footer">
        <div className="provreq-footer-left">
          {attachedPhoto && (
            <div
              className="provreq-attachment-preview"
              onClick={() => onSelectPhoto(attachedPhoto)}
              title="Click to view photo"
            >
              <img src={attachedPhoto} alt="Attachment thumbnail" className="provreq-attachment-thumb" />
              <span className="provreq-attachment-label">Photo attached</span>
            </div>
          )}
        </div>

        <div className="provreq-footer-right">
          {!isCancelled && onChat && (
            <button
              type="button"
              className="provreq-action-chat-btn"
              onClick={() => onChat(request)}
              title="Chat with Customer"
            >
              <i className="fas fa-comment-dots"></i>
              <span>Chat</span>
            </button>
          )}

          <button
            type="button"
            className="provreq-action-link"
            onClick={() => onViewDetails(request)}
          >
            <span>View Details</span>
          </button>

          {isCancelled ? (
            <button
              type="button"
              className="provreq-btn-quote disabled"
              disabled
            >
              <span>Cancelled</span>
            </button>
          ) : isExpired ? (
            <button
              type="button"
              className="provreq-btn-quote disabled"
              disabled
            >
              <span>Expired</span>
            </button>
          ) : request.has_quoted ? (
            <button
              type="button"
              className="provreq-btn-quoted"
              onClick={() => (onViewQuotation ? onViewQuotation(request) : onViewDetails(request))}
              title="You have already quoted on this request"
            >
              <i className="fas fa-check-circle"></i>
              <span>View Your Quote</span>
            </button>
          ) : (
            <button
              type="button"
              className="provreq-btn-quote"
              onClick={() => onQuote(request)}
            >
              <span>Send Quote</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
