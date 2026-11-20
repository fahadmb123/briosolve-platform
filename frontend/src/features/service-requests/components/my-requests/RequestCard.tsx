import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import { checkRequestEditPermission } from "../../utils/serviceRequestEdit.utils";
import { getCategoryVisualConfig } from "../../utils/categoryIcon.utils";

interface RequestCardProps {
  request: CustomerServiceRequestItem;
  onViewDetails: (request: CustomerServiceRequestItem) => void;
  onEditRequest: (request: CustomerServiceRequestItem) => void;
  onCancelRequest: (request: CustomerServiceRequestItem) => void;
  onReopenRequest?: (request: CustomerServiceRequestItem) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onViewDetails,
  onEditRequest,
  onCancelRequest,
  onReopenRequest,
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const visual = getCategoryVisualConfig(request.category_name, request.subservice_name);
  const permission = checkRequestEditPermission(request);
  const canCancel = request.status === "PENDING" || request.status === "ACTIVE";

  const getUrgencyText = () => {
    if (request.status === "EXPIRED") {
      const expDate = request.created_at
        ? new Date(request.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric"
          })
        : "Past due";
      return `Expired: ${expDate}`;
    }
    if (request.specific_date) {
      const dateStr = new Date(request.specific_date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
      return `Required by: ${dateStr}`;
    }
    switch (request.urgency) {
      case "TODAY":
        return "Required: Today";
      case "THIS_WEEK":
        return "Required: This Week";
      case "FLEXIBLE":
        return "Schedule: Flexible";
      default:
        return "Scheduled Service";
    }
  };

  const addressText = request.address_details
    ? `${request.address_details.area || ""}, ${request.address_details.city || ""}`.trim().replace(/^,|,$/g, "")
    : "Address on file";

  const formattedDate = new Date(request.created_at).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const quotesCount = request.quotations_count ?? 0;
  const notifiedCount = request.matched_providers_count ?? 0;
  const isExpired = request.status === "EXPIRED";

  const renderStatusBadge = () => {
    switch (request.status) {
      case "EXPIRED":
        return (
          <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
            <span className="myreq-badge-pill myreq-badge-expired">
              <span className="myreq-dot-indicator"></span>
              <span>Expired</span>
            </span>
            {request.latest_booking?.payment_status === "REFUNDED" && (
              <span className="myreq-badge-pill" style={{ background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" }}>
                <i className="fas fa-undo-alt" style={{ fontSize: "0.65rem", marginRight: "3px" }}></i>
                <span>100% Refunded</span>
              </span>
            )}
          </div>
        );
      case "COMPLETED":
        return (
          <span className="myreq-badge-pill myreq-badge-completed">
            <span className="myreq-dot-indicator"></span>
            <span>Completed</span>
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="myreq-badge-pill myreq-badge-progress">
            <span className="myreq-dot-indicator"></span>
            <span>In Progress</span>
          </span>
        );
      case "ACCEPTED":
        if (request.latest_booking?.status === "COMPLETED") {
          return (
            <span className="myreq-badge-pill myreq-badge-completed">
              <span className="myreq-dot-indicator"></span>
              <span>Completed</span>
            </span>
          );
        }
        return (
          <span className="myreq-badge-pill myreq-badge-accepted">
            <span className="myreq-dot-indicator"></span>
            <span>Accepted</span>
          </span>
        );
      case "ACTIVE":
        return (
          <span className="myreq-badge-pill myreq-badge-active">
            <span className="myreq-dot-indicator"></span>
            <span>Active</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="myreq-badge-pill myreq-badge-cancelled">
            <span className="myreq-dot-indicator"></span>
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="myreq-badge-pill myreq-badge-pending">
            <span className="myreq-dot-indicator"></span>
            <span>Pending</span>
          </span>
        );
    }
  };

  const attachedPhoto = request.images && request.images.length > 0 ? request.images[0].image_key : null;
  const serviceImageUrl =
    request.subservice_image ||
    request.category_image ||
    attachedPhoto;

  const showServiceImage = Boolean(serviceImageUrl && !imageError);

  return (
    <div className="myreq-row-card">
      <div className="myreq-card-header">
        <div className="myreq-header-left">
          {showServiceImage ? (
            <div
              className="myreq-category-avatar has-image"
              onClick={() => onViewDetails(request)}
              title={request.subservice_name || request.category_name || "Service"}
            >
              <img
                src={serviceImageUrl!}
                alt={request.subservice_name || request.category_name || "Service"}
                className="myreq-avatar-img"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div
              className="myreq-category-avatar"
              style={{ backgroundColor: visual.bgColor, color: visual.textColor }}
              aria-hidden="true"
            >
              <i className={visual.icon}></i>
            </div>
          )}

          <div className="myreq-row-breadcrumbs">
            <span className="myreq-crumb-category">{request.category_name || "General Service"}</span>
            {request.subservice_name && (
              <>
                <span className="myreq-crumb-sep">/</span>
                <span className="myreq-crumb-sub">{request.subservice_name}</span>
              </>
            )}
            <span className="myreq-crumb-bullet">•</span>
            <span className="myreq-crumb-date">Posted {formattedDate}</span>
          </div>
        </div>

        <div className="myreq-header-right">
          {renderStatusBadge()}
        </div>
      </div>

      <div className="myreq-card-body">
        <h3 className="myreq-row-title" onClick={() => onViewDetails(request)}>
          {request.title}
        </h3>

        <p className="myreq-row-desc">{request.description}</p>

        <div className="myreq-row-meta">
          <div className="myreq-meta-tag">
            <i className="far fa-calendar-alt"></i>
            <span>{getUrgencyText()}</span>
          </div>

          <div className="myreq-meta-tag">
            <i className="far fa-clock"></i>
            <span>
              {request.available_time_from?.slice(0, 5) || "09:00"} - {request.available_time_to?.slice(0, 5) || "17:00"}
            </span>
          </div>

          <div className="myreq-meta-tag location">
            <i className="fas fa-map-marker-alt"></i>
            <span className="myreq-meta-location-text">{addressText}</span>
          </div>

          {quotesCount > 0 ? (
            <div className="myreq-meta-tag quotes-received">
              <i className="far fa-file-alt"></i>
              <span>{quotesCount} {quotesCount === 1 ? "Quotation" : "Quotations"} Received</span>
            </div>
          ) : notifiedCount > 0 ? (
            <div className="myreq-meta-tag notified-providers">
              <i className="far fa-paper-plane"></i>
              <span>{notifiedCount} {notifiedCount === 1 ? "provider" : "providers"} notified</span>
            </div>
          ) : null}

          {request.latest_booking && request.latest_booking.status === "COMPLETED" ? (
            <div
              className="myreq-meta-tag completed"
              style={{
                color: "#15803d",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                fontWeight: 600,
                cursor: "pointer"
              }}
              onClick={() => navigate(`/bookings/${request.latest_booking?.id}`)}
              title="Click to view completed booking"
            >
              <i className="fas fa-check-circle"></i>
              <span>Booking #{request.latest_booking.booking_number} Completed</span>
            </div>
          ) : request.latest_booking && request.latest_booking.status !== "CANCELLED" ? (
            <div
              className="myreq-meta-tag"
              style={{
                color: "#0369a1",
                background: "#f0f9ff",
                border: "1px solid #bae6fd",
                fontWeight: 500,
                cursor: "pointer"
              }}
              onClick={() => navigate(`/bookings/${request.latest_booking?.id}`)}
              title="Click to view booking"
            >
              <i className="fas fa-calendar-check"></i>
              <span>Booking #{request.latest_booking.booking_number} ({request.latest_booking.status.replace("_", " ")})</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="myreq-card-footer">
        <div className="myreq-footer-left">
          {attachedPhoto && (
            <div
              className="myreq-attachment-preview"
              onClick={() => onViewDetails(request)}
              title="View attachment"
            >
              <img src={attachedPhoto} alt="Attachment thumbnail" className="myreq-attachment-thumb" />
              <span className="myreq-attachment-label">Photo attached</span>
            </div>
          )}
        </div>

        <div className="myreq-footer-right">
          {permission.canEdit && !isExpired && (
            <button
              type="button"
              className="myreq-action-link"
              onClick={() => onEditRequest(request)}
            >
              <span>Edit</span>
              {permission.isRestricted && <span className="myreq-edit-dot-restricted" />}
            </button>
          )}

          {canCancel && !isExpired && (
            <button
              type="button"
              className="myreq-action-link danger"
              onClick={() => onCancelRequest(request)}
            >
              Cancel Request
            </button>
          )}

          {isExpired && onReopenRequest && (
            <button
              type="button"
              className="myreq-action-reopen-link"
              onClick={() => onReopenRequest(request)}
            >
              <i className="fas fa-sync-alt"></i>
              <span>Reopen</span>
            </button>
          )}

          {request.latest_booking?.id && (
            <button
              type="button"
              className="myreq-action-link"
              onClick={() => navigate(`/bookings/${request.latest_booking?.id}`)}
              style={{
                color: request.latest_booking.status === "COMPLETED" ? "#15803d" : "#c2410c",
                fontWeight: 600
              }}
            >
              <i className="fas fa-receipt" style={{ marginRight: "4px" }}></i>
              <span>{request.latest_booking.status === "COMPLETED" ? "View Completed Booking" : "View Booking"}</span>
            </button>
          )}

          <button
            type="button"
            className={`myreq-btn-view-details ${quotesCount > 0 ? "has-quotes" : ""}`}
            onClick={() => onViewDetails(request)}
          >
            <span>{quotesCount > 0 ? `View Quotations (${quotesCount})` : "View Details"}</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
