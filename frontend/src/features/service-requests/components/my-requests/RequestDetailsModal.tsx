import React, { useState } from "react";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import { checkRequestEditPermission } from "../../utils/serviceRequestEdit.utils";

interface RequestDetailsModalProps {
  request: CustomerServiceRequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEditRequest: (request: CustomerServiceRequestItem) => void;
  onCancelRequest: (request: CustomerServiceRequestItem) => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  request,
  isOpen,
  onClose,
  onEditRequest,
  onCancelRequest,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  const canCancel = request.status === "PENDING" || request.status === "ACTIVE";
  const permission = checkRequestEditPermission(request);

  const formattedDate = new Date(request.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getUrgencyText = () => {
    if (request.specific_date) {
      const dateStr = new Date(request.specific_date).toISOString().split("T")[0];
      return `Specific Date: ${dateStr}`;
    }
    switch (request.urgency) {
      case "TODAY":
        return "Today (Urgent)";
      case "THIS_WEEK":
        return "This Week";
      case "FLEXIBLE":
        return "Flexible Schedule";
      default:
        return "Standard Schedule";
    }
  };

  const getStatusVariant = (status: CustomerServiceRequestItem["status"]) => {
    switch (status) {
      case "PENDING":
        return "pending";
      case "ACTIVE":
        return "active";
      case "ACCEPTED":
        return "accepted";
      case "IN_PROGRESS":
        return "in-progress";
      case "COMPLETED":
        return "completed";
      case "CANCELLED":
        return "cancelled";
      case "EXPIRED":
        return "expired";
      default:
        return "default";
    }
  };

  return (
    <div className="myreq-modal-overlay" onClick={onClose}>
      <div
        className="myreq-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="myreq-modal-header">
          <div className="myreq-modal-header-titles">
            <div className="myreq-modal-header-tag-row">
              <span className="myreq-modal-category">
                <i className="fas fa-layer-group"></i>
                <span>{request.category_name || "General"}</span>
                {request.subservice_name && (
                  <>
                    <span className="separator">/</span>
                    <span>{request.subservice_name}</span>
                  </>
                )}
              </span>

              <span className={`myreq-status-pill ${getStatusVariant(request.status)}`}>
                <span className="myreq-status-dot"></span>
                <span>{request.status.replace("_", " ")}</span>
              </span>
            </div>

            <h2 className="myreq-modal-title">{request.title}</h2>
            <div className="myreq-modal-date-row">
              <i className="far fa-clock"></i>
              <span>Created on {formattedDate}</span>
            </div>
          </div>

          <button
            type="button"
            className="myreq-modal-btn-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="myreq-modal-content-scroll">
          <div className="myreq-modal-block">
            <h4 className="myreq-block-heading">Description</h4>
            <p className="myreq-description-body">{request.description}</p>
          </div>

          <div className="myreq-modal-two-col">
            <div className="myreq-modal-block">
              <h4 className="myreq-block-heading">Schedule & Timing</h4>
              <div className="myreq-key-value-list">
                <div className="myreq-kv-item">
                  <span className="myreq-kv-key">Timeline</span>
                  <span className="myreq-kv-val">{getUrgencyText()}</span>
                </div>
                <div className="myreq-kv-item">
                  <span className="myreq-kv-key">Preferred Hours</span>
                  <span className="myreq-kv-val">
                    {request.available_time_from.slice(0, 5)} - {request.available_time_to.slice(0, 5)}
                  </span>
                </div>
              </div>
            </div>

            <div className="myreq-modal-block">
              <h4 className="myreq-block-heading">Budget Details</h4>
              <div className="myreq-key-value-list">
                <div className="myreq-kv-item">
                  <span className="myreq-kv-key">Pricing Model</span>
                  <span className="myreq-kv-val">
                    {request.budget_type === "FIXED" ? "Fixed Price" : "Open for Quotes"}
                  </span>
                </div>
                {request.budget_type === "FIXED" && request.budget_amount && (
                  <div className="myreq-kv-item">
                    <span className="myreq-kv-key">Target Amount</span>
                    <span className="myreq-kv-val bold">₹{request.budget_amount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="myreq-modal-block">
            <h4 className="myreq-block-heading">Service Location</h4>
            {request.address_details ? (
              <div className="myreq-location-box">
                <i className="fas fa-map-pin myreq-location-pin"></i>
                <div className="myreq-location-details">
                  <p className="myreq-address-primary">
                    {request.address_details.house_no ? `${request.address_details.house_no}, ` : ""}
                    {request.address_details.area}
                  </p>
                  <p className="myreq-address-secondary">
                    {request.address_details.city}
                    {request.address_details.district ? `, ${request.address_details.district}` : ""},{" "}
                    {request.address_details.state} - {request.address_details.pincode}
                  </p>
                  {request.address_details.landmark && (
                    <span className="myreq-address-landmark">
                      Landmark: {request.address_details.landmark}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="myreq-text-secondary">Default address on file</p>
            )}
          </div>

          {request.images && request.images.length > 0 && (
            <div className="myreq-modal-block">
              <h4 className="myreq-block-heading">Attachments ({request.images.length})</h4>
              <div className="myreq-modal-thumbnails-grid">
                {request.images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="myreq-modal-thumb-item"
                    onClick={() => setSelectedPhoto(img.image_key)}
                  >
                    <img
                      src={img.image_key}
                      alt={`Requirement visual ${idx + 1}`}
                      className="myreq-modal-thumb-img"
                    />
                    <div className="myreq-modal-thumb-zoom">
                      <i className="fas fa-search-plus"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {typeof request.matched_providers_count === "number" && (
            <div className="myreq-callout-notice">
              <i className="fas fa-info-circle"></i>
              <div>
                <strong>{request.matched_providers_count} nearby verified providers</strong> were dispatched this requirement. Review incoming responses in your notifications or bookings when available.
              </div>
            </div>
          )}
        </div>

        <div className="myreq-modal-footer">
          {permission.canEdit && (
            <button
              type="button"
              className="myreq-btn-edit-modal"
              onClick={() => {
                onClose();
                onEditRequest(request);
              }}
            >
              <i className="fas fa-edit"></i>
              <span>Edit Request</span>
              {permission.isRestricted && <span className="myreq-edit-dot-restricted" />}
            </button>
          )}

          {canCancel && (
            <button
              type="button"
              className="myreq-btn-danger-outline"
              onClick={() => {
                onClose();
                onCancelRequest(request);
              }}
            >
              <i className="fas fa-ban"></i>
              <span>Cancel Request</span>
            </button>
          )}

          <button type="button" className="myreq-btn-subtle" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      {selectedPhoto && (
        <div className="myreq-lightbox-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="myreq-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto} alt="Full view" className="myreq-lightbox-img" />
            <button
              type="button"
              className="myreq-lightbox-close"
              onClick={() => setSelectedPhoto(null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
