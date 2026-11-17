import React, { useState } from "react";
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
    if (isExpired) {
      return (
        <span className="myreq-badge-pill myreq-badge-expired">
          <span className="myreq-dot-indicator"></span>
          <span>Expired</span>
        </span>
      );
    }

    if (quotesCount > 0) {
      return (
        <span className="myreq-badge-pill myreq-badge-quotes">
          <i className="fas fa-bolt"></i>
          <span>{quotesCount} {quotesCount === 1 ? "quote" : "quotes"} arriving</span>
        </span>
      );
    }

    if (notifiedCount > 0) {
      return (
        <span className="myreq-badge-pill myreq-badge-notified">
          <i className="fas fa-user-friends"></i>
          <span>{notifiedCount} {notifiedCount === 1 ? "professional" : "professionals"} notified</span>
        </span>
      );
    }

    if (request.status === "COMPLETED") {
      return (
        <span className="myreq-badge-pill myreq-badge-completed">
          <span className="myreq-dot-indicator"></span>
          <span>Completed</span>
        </span>
      );
    }

    if (request.status === "IN_PROGRESS") {
      return (
        <span className="myreq-badge-pill myreq-badge-progress">
          <span className="myreq-dot-indicator"></span>
          <span>In Progress</span>
        </span>
      );
    }

    if (request.status === "CANCELLED") {
      return (
        <span className="myreq-badge-pill myreq-badge-cancelled">
          <span className="myreq-dot-indicator"></span>
          <span>Cancelled</span>
        </span>
      );
    }

    return (
      <span className="myreq-badge-pill myreq-badge-pending">
        <span className="myreq-dot-indicator"></span>
        <span>Pending</span>
      </span>
    );
  };

  const attachedPhoto = request.images && request.images.length > 0 ? request.images[0].image_key : null;
  const serviceImageUrl =
    request.subservice_image ||
    request.category_image ||
    attachedPhoto;

  const showServiceImage = Boolean(serviceImageUrl && !imageError);

  return (
    <div className="myreq-row-card">
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

      <div className="myreq-row-center">
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
        </div>
      </div>

      <div className="myreq-row-right">
        {renderStatusBadge()}

        {attachedPhoto && (
          <div
            className="myreq-row-thumb"
            onClick={() => onViewDetails(request)}
            title="View attachment"
          >
            <img src={attachedPhoto} alt="Attachment thumbnail" />
          </div>
        )}

        <div className="myreq-row-actions">
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
              Cancel
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

          <button
            type="button"
            className="myreq-btn-view-details"
            onClick={() => onViewDetails(request)}
          >
            <span>View Details</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
