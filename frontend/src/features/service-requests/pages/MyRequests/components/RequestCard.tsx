import React from "react";
import type { CustomerServiceRequestItem } from "../../../types/serviceRequest.types";

interface RequestCardProps {
  request: CustomerServiceRequestItem;
  onViewDetails: (request: CustomerServiceRequestItem) => void;
  onCancelRequest: (request: CustomerServiceRequestItem) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onViewDetails,
  onCancelRequest,
}) => {
  const getStatusBadge = (status: CustomerServiceRequestItem["status"]) => {
    switch (status) {
      case "PENDING":
        return { label: "Pending", className: "status-pending", icon: "fa-clock" };
      case "ACTIVE":
        return { label: "Active", className: "status-active", icon: "fa-bolt" };
      case "ACCEPTED":
        return { label: "Accepted", className: "status-accepted", icon: "fa-check" };
      case "IN_PROGRESS":
        return { label: "In Progress", className: "status-in-progress", icon: "fa-spinner fa-spin" };
      case "COMPLETED":
        return { label: "Completed", className: "status-completed", icon: "fa-check-circle" };
      case "CANCELLED":
        return { label: "Cancelled", className: "status-cancelled", icon: "fa-times-circle" };
      case "EXPIRED":
        return { label: "Expired", className: "status-expired", icon: "fa-calendar-times" };
      default:
        return { label: status, className: "status-default", icon: "fa-info-circle" };
    }
  };

  const getUrgencyText = () => {
    if (request.specific_date) {
      const dateStr = new Date(request.specific_date).toISOString().split("T")[0];
      return `Needed by ${dateStr}`;
    }
    switch (request.urgency) {
      case "TODAY":
        return "Needed Today";
      case "THIS_WEEK":
        return "Needed This Week";
      case "FLEXIBLE":
        return "Flexible Schedule";
      default:
        return "Specific Date";
    }
  };

  const statusInfo = getStatusBadge(request.status);
  const canCancel = request.status === "PENDING" || request.status === "ACTIVE";

  const addressText = request.address_details
    ? `${request.address_details.area}, ${request.address_details.city}`
    : "Address on file";

  const formattedDate = new Date(request.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="myreq-card">
      <div className="myreq-card-top">
        <div className="myreq-card-tags">
          {request.category_name && (
            <span className="myreq-category-tag">
              <i className="fas fa-layer-group"></i>
              <span>{request.category_name}</span>
            </span>
          )}
          {request.subservice_name && (
            <span className="myreq-subservice-tag">
              <i className="fas fa-wrench"></i>
              <span>{request.subservice_name}</span>
            </span>
          )}
        </div>

        <div className={`myreq-status-badge ${statusInfo.className}`}>
          <i className={`fas ${statusInfo.icon}`}></i>
          <span>{statusInfo.label}</span>
        </div>
      </div>

      <div className="myreq-card-body">
        <h3 className="myreq-card-title">{request.title}</h3>
        <p className="myreq-card-desc">{request.description}</p>

        <div className="myreq-card-meta-grid">
          <div className="myreq-meta-item">
            <i className="fas fa-calendar-alt text-primary"></i>
            <span>{getUrgencyText()}</span>
          </div>

          <div className="myreq-meta-item">
            <i className="fas fa-clock text-info"></i>
            <span>
              {request.available_time_from.slice(0, 5)} - {request.available_time_to.slice(0, 5)}
            </span>
          </div>

          <div className="myreq-meta-item">
            <i className="fas fa-map-marker-alt text-danger"></i>
            <span className="truncate">{addressText}</span>
          </div>

          <div className="myreq-meta-item">
            <i className="fas fa-wallet text-success"></i>
            <span>
              {request.budget_type === "FIXED" && request.budget_amount
                ? `Fixed: ₹${request.budget_amount}`
                : "Open for Bids"}
            </span>
          </div>
        </div>

        {request.images && request.images.length > 0 && (
          <div className="myreq-card-photos">
            {request.images.slice(0, 3).map((img, idx) => (
              <img
                key={img.id || idx}
                src={img.image_key}
                alt="Request attachment"
                className="myreq-photo-thumb"
              />
            ))}
            {request.images.length > 3 && (
              <span className="myreq-photo-more">+{request.images.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="myreq-card-footer">
        <div className="myreq-footer-left">
          <span className="myreq-created-date">
            <i className="far fa-clock"></i>
            <span>Posted {formattedDate}</span>
          </span>
          {typeof request.matched_providers_count === "number" && (
            <span className="myreq-providers-count-pill">
              <i className="fas fa-user-check"></i>
              <span>{request.matched_providers_count} matched</span>
            </span>
          )}
        </div>

        <div className="myreq-footer-actions">
          {canCancel && (
            <button
              type="button"
              className="myreq-btn-cancel"
              onClick={() => onCancelRequest(request)}
            >
              <i className="fas fa-ban"></i>
              <span>Cancel</span>
            </button>
          )}

          <button
            type="button"
            className="myreq-btn-view"
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

