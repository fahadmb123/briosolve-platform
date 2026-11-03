import React, { useState } from "react";
import type { CustomerServiceRequestItem } from "../../../types/serviceRequest.types";

interface RequestDetailsModalProps {
  request: CustomerServiceRequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelRequest: (request: CustomerServiceRequestItem) => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  request,
  isOpen,
  onClose,
  onCancelRequest,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  const canCancel = request.status === "PENDING" || request.status === "ACTIVE";

  const formattedDate = new Date(request.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
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
        return "Standard";
    }
  };

  return (
    <div className="myreq-modal-overlay" onClick={onClose}>
      <div
        className="myreq-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="myreq-modal-header">
          <div className="myreq-modal-header-title-group">
            <div className="myreq-modal-badges">
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
              <span className={`myreq-status-badge status-${request.status.toLowerCase().replace('_', '-')}`}>
                {request.status}
              </span>
            </div>
            <h2>{request.title}</h2>
            <span className="myreq-modal-created-time">
              <i className="far fa-clock"></i> Posted on {formattedDate}
            </span>
          </div>

          <button
            type="button"
            className="myreq-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="myreq-modal-body">
          <div className="myreq-modal-section">
            <h4 className="myreq-modal-section-title">
              <i className="fas fa-align-left text-primary"></i>
              <span>Requirement Description</span>
            </h4>
            <p className="myreq-modal-description-text">{request.description}</p>
          </div>

          <div className="myreq-modal-grid-2">
            <div className="myreq-modal-section">
              <h4 className="myreq-modal-section-title">
                <i className="fas fa-calendar-check text-info"></i>
                <span>Schedule & Urgency</span>
              </h4>
              <div className="myreq-modal-info-list">
                <div className="myreq-modal-info-row">
                  <span className="label">Timeline:</span>
                  <span className="value font-medium">{getUrgencyText()}</span>
                </div>
                <div className="myreq-modal-info-row">
                  <span className="label">Preferred Window:</span>
                  <span className="value font-medium">
                    {request.available_time_from.slice(0, 5)} - {request.available_time_to.slice(0, 5)}
                  </span>
                </div>
              </div>
            </div>

            <div className="myreq-modal-section">
              <h4 className="myreq-modal-section-title">
                <i className="fas fa-wallet text-success"></i>
                <span>Budget & Pricing</span>
              </h4>
              <div className="myreq-modal-info-list">
                <div className="myreq-modal-info-row">
                  <span className="label">Budget Type:</span>
                  <span className="value font-medium">
                    {request.budget_type === "FIXED" ? "Fixed Budget" : "Open for Quotes"}
                  </span>
                </div>
                {request.budget_type === "FIXED" && request.budget_amount && (
                  <div className="myreq-modal-info-row">
                    <span className="label">Estimated Amount:</span>
                    <span className="value font-bold text-success">₹{request.budget_amount}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="myreq-modal-section">
            <h4 className="myreq-modal-section-title">
              <i className="fas fa-map-marked-alt text-danger"></i>
              <span>Service Location</span>
            </h4>
            {request.address_details ? (
              <div className="myreq-modal-address-box">
                <p className="address-line">
                  {request.address_details.house_no ? `${request.address_details.house_no}, ` : ""}
                  {request.address_details.area}
                </p>
                <p className="address-line">
                  {request.address_details.city}
                  {request.address_details.district ? `, ${request.address_details.district}` : ""},{" "}
                  {request.address_details.state} - {request.address_details.pincode}
                </p>
                {request.address_details.landmark && (
                  <p className="address-landmark">
                    <i className="fas fa-map-pin text-xs mr-1"></i> Landmark: {request.address_details.landmark}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-secondary text-sm">Primary address on file</p>
            )}
          </div>

          {request.images && request.images.length > 0 && (
            <div className="myreq-modal-section">
              <h4 className="myreq-modal-section-title">
                <i className="fas fa-camera text-warning"></i>
                <span>Attached Photos ({request.images.length})</span>
              </h4>
              <div className="myreq-modal-gallery">
                {request.images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="myreq-gallery-thumb-wrapper"
                    onClick={() => setSelectedPhoto(img.image_key)}
                  >
                    <img
                      src={img.image_key}
                      alt={`Attachment ${idx + 1}`}
                      className="myreq-gallery-thumb"
                    />
                    <div className="myreq-gallery-zoom-overlay">
                      <i className="fas fa-search-plus"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {typeof request.matched_providers_count === "number" && (
            <div className="myreq-modal-section myreq-providers-notice">
              <i className="fas fa-bell text-primary"></i>
              <div>
                <strong>{request.matched_providers_count} verified providers</strong> in your area were notified about this requirement. You will receive notifications as soon as quotes are submitted.
              </div>
            </div>
          )}
        </div>

        <div className="myreq-modal-footer">
          {canCancel && (
            <button
              type="button"
              className="myreq-btn-danger"
              onClick={() => {
                onClose();
                onCancelRequest(request);
              }}
            >
              <i className="fas fa-ban"></i>
              <span>Cancel This Request</span>
            </button>
          )}

          <button type="button" className="myreq-btn-secondary" onClick={onClose}>
            <span>Close</span>
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

