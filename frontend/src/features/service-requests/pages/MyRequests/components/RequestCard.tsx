import React from "react";
import type { CustomerServiceRequestItem } from "../../../types/serviceRequest.types";
import { checkRequestEditPermission } from "../../../utils/serviceRequestEdit.utils";

interface RequestCardProps {
  request: CustomerServiceRequestItem;
  onViewDetails: (request: CustomerServiceRequestItem) => void;
  onEditRequest: (request: CustomerServiceRequestItem) => void;
  onCancelRequest: (request: CustomerServiceRequestItem) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onViewDetails,
  onEditRequest,
  onCancelRequest,
}) => {
  const getStatusBadge = (status: CustomerServiceRequestItem["status"]) => {
    switch (status) {
      case "PENDING":
        return { label: "Pending Quotes", variant: "pending" };
      case "ACTIVE":
        return { label: "Active", variant: "active" };
      case "ACCEPTED":
        return { label: "Accepted", variant: "accepted" };
      case "IN_PROGRESS":
        return { label: "In Progress", variant: "in-progress" };
      case "COMPLETED":
        return { label: "Completed", variant: "completed" };
      case "CANCELLED":
        return { label: "Cancelled", variant: "cancelled" };
      case "EXPIRED":
        return { label: "Expired", variant: "expired" };
      default:
        return { label: status, variant: "default" };
    }
  };

  const getUrgencyText = () => {
    if (request.specific_date) {
      const dateStr = new Date(request.specific_date).toISOString().split("T")[0];
      return `By ${dateStr}`;
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
  const permission = checkRequestEditPermission(request);
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
    <div className="myreq-clean-card">
      <div className="myreq-card-top-row">
        <div className="myreq-card-category-crumbs">
          <i className="fas fa-layer-group myreq-crumb-icon"></i>
          <span className="myreq-category-name">{request.category_name || "Service"}</span>
          {request.subservice_name && (
            <>
              <span className="myreq-crumb-separator">/</span>
              <span className="myreq-subservice-name">{request.subservice_name}</span>
            </>
          )}
        </div>

        <div className={`myreq-status-pill ${statusInfo.variant}`}>
          <span className="myreq-status-dot"></span>
          <span>{statusInfo.label}</span>
        </div>
      </div>

      <div className="myreq-card-content">
        <h3 className="myreq-card-headline" onClick={() => onViewDetails(request)}>
          {request.title}
        </h3>
        <p className="myreq-card-description">{request.description}</p>

        <div className="myreq-meta-row">
          <div className="myreq-meta-chip" title="Schedule">
            <i className="far fa-calendar-alt"></i>
            <span>{getUrgencyText()}</span>
          </div>

          <div className="myreq-meta-chip" title="Time window">
            <i className="far fa-clock"></i>
            <span>
              {request.available_time_from.slice(0, 5)} - {request.available_time_to.slice(0, 5)}
            </span>
          </div>

          <div className="myreq-meta-chip" title="Location">
            <i className="fas fa-map-marker-alt"></i>
            <span className="myreq-meta-text-truncate">{addressText}</span>
          </div>

          <div className="myreq-meta-chip budget" title="Budget">
            <i className="fas fa-wallet"></i>
            <span>
              {request.budget_type === "FIXED" && request.budget_amount
                ? `₹${request.budget_amount}`
                : "Open Bids"}
            </span>
          </div>
        </div>

        {request.images && request.images.length > 0 && (
          <div className="myreq-photos-strip">
            {request.images.slice(0, 3).map((img, idx) => (
              <img
                key={img.id || idx}
                src={img.image_key}
                alt="Attachment thumbnail"
                className="myreq-photo-item"
                onClick={() => onViewDetails(request)}
              />
            ))}
            {request.images.length > 3 && (
              <span className="myreq-photos-overflow">+{request.images.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className="myreq-card-bottom-row">
        <div className="myreq-meta-footer">
          <span className="myreq-post-date">Posted {formattedDate}</span>
          {typeof request.matched_providers_count === "number" && (
            <span className="myreq-notified-badge">
              <i className="fas fa-users"></i>
              <span>{request.matched_providers_count} notified</span>
            </span>
          )}
        </div>

        <div className="myreq-card-actions">
          {permission.canEdit && (
            <button
              type="button"
              className="myreq-btn-edit"
              onClick={() => onEditRequest(request)}
              title={permission.isRestricted ? "Edit request (Restricted - quotations received)" : "Edit request"}
            >
              <i className="fas fa-edit"></i>
              <span>Edit</span>
              {permission.isRestricted && <span className="myreq-edit-dot-restricted" />}
            </button>
          )}

          {canCancel && (
            <button
              type="button"
              className="myreq-btn-link-danger"
              onClick={() => onCancelRequest(request)}
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            className="myreq-btn-details"
            onClick={() => onViewDetails(request)}
          >
            <span>View Details</span>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
