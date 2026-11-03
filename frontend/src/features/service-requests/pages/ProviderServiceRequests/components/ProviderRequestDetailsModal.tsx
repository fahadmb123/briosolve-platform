import { useState, type FC } from "react";
import type { CustomerServiceRequestItem } from "../../../types/serviceRequest.types";

interface ProviderRequestDetailsModalProps {
  request: CustomerServiceRequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onQuote: (request: CustomerServiceRequestItem) => void;
  onSelectPhoto: (photoUrl: string) => void;
}

export const ProviderRequestDetailsModal: FC<ProviderRequestDetailsModalProps> = ({
  request,
  isOpen,
  onClose,
  onQuote,
  onSelectPhoto,
}) => {
  const [copiedId, setCopiedId] = useState<boolean>(false);

  if (!isOpen || !request) return null;

  const copyRequestId = () => {
    navigator.clipboard.writeText(request.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getUrgencyText = () => {
    if (request.specific_date) {
      const dateStr = new Date(request.specific_date).toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return `Specific Date: ${dateStr}`;
    }
    switch (request.urgency) {
      case "TODAY":
        return "Urgent • Today";
      case "THIS_WEEK":
        return "Within This Week";
      case "FLEXIBLE":
        return "Flexible Schedule";
      default:
        return "Standard Request";
    }
  };

  const formattedDate = new Date(request.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const address = request.address_details;
  const fullAddressString = address
    ? [address.house_no, address.landmark, address.area, address.city, address.district, address.state, address.pincode]
        .filter(Boolean)
        .join(", ")
    : "Local client service area";

  return (
    <div className="provreq-modal-overlay" onClick={onClose}>
      <div
        className="provreq-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="provreq-modal-header">
          <div className="provreq-header-top-meta">
            <span className="provreq-category-badge">
              <i className="fas fa-layer-group mr-1.5"></i>
              {request.category_name || "General Service"}
              {request.subservice_name ? ` • ${request.subservice_name}` : ""}
            </span>
            <span className="provreq-date-badge">
              <i className="far fa-calendar mr-1"></i> Posted {formattedDate}
            </span>
          </div>

          <h2 className="provreq-modal-title">{request.title}</h2>

          <div className="provreq-id-row">
            <span className="provreq-id-text">ID: {request.id.slice(0, 12)}...</span>
            <button
              type="button"
              className="provreq-btn-copy"
              onClick={copyRequestId}
              title="Copy Request ID"
            >
              <i className={`fas ${copiedId ? "fa-check text-success" : "fa-copy"}`}></i>
              <span>{copiedId ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <button
            type="button"
            className="provreq-modal-btn-close"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="provreq-modal-content-scroll">
          <div className="provreq-detail-section">
            <h4 className="provreq-section-heading">
              <i className="fas fa-align-left"></i>
              <span>Requirement Description & Scope</span>
            </h4>
            <div className="provreq-description-box">
              <p>{request.description}</p>
            </div>
          </div>

          <div className="provreq-details-grid-2">
            <div className="provreq-detail-card">
              <div className="provreq-detail-card-header">
                <i className="far fa-clock"></i>
                <h5>Timing & Urgency</h5>
              </div>
              <div className="provreq-detail-card-body">
                <div className="provreq-info-row">
                  <span className="provreq-info-label">Urgency</span>
                  <span className="provreq-info-val highlight">{getUrgencyText()}</span>
                </div>
                <div className="provreq-info-row">
                  <span className="provreq-info-label">Preferred Hours</span>
                  <span className="provreq-info-val">
                    {request.available_time_from?.slice(0, 5) || "09:00"} to{" "}
                    {request.available_time_to?.slice(0, 5) || "17:00"}
                  </span>
                </div>
              </div>
            </div>

            <div className="provreq-detail-card">
              <div className="provreq-detail-card-header">
                <i className="fas fa-wallet"></i>
                <h5>Quotation & Budget</h5>
              </div>
              <div className="provreq-detail-card-body">
                <div className="provreq-info-row">
                  <span className="provreq-info-label">Preference</span>
                  <span className="provreq-info-val">
                    {request.budget_type === "FIXED" ? "Fixed Budget" : "Open for Competitive Bids"}
                  </span>
                </div>
                <div className="provreq-info-row">
                  <span className="provreq-info-label">Target Amount</span>
                  <span className="provreq-info-val highlight">
                    {request.budget_type === "FIXED" && request.budget_amount
                      ? `₹${request.budget_amount.toLocaleString()}`
                      : "Open to your best quote"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="provreq-detail-section">
            <h4 className="provreq-section-heading">
              <i className="fas fa-map-marker-alt"></i>
              <span>Service Location</span>
            </h4>
            <div className="provreq-location-box">
              <div className="provreq-location-main">
                <strong>{address?.area || "Local Area"}, {address?.city || "City"}</strong>
                <p>{fullAddressString}</p>
              </div>
              {address?.landmark && (
                <div className="provreq-landmark-chip">
                  <i className="fas fa-map-pin"></i>
                  <span>Near: {address.landmark}</span>
                </div>
              )}
            </div>
          </div>

          {request.images && request.images.length > 0 && (
            <div className="provreq-detail-section">
              <div className="provreq-section-heading-row">
                <h4 className="provreq-section-heading">
                  <i className="fas fa-camera"></i>
                  <span>Attached Client Photos ({request.images.length})</span>
                </h4>
                <span className="provreq-hint-text">Click any photo to inspect full size</span>
              </div>
              <div className="provreq-modal-gallery">
                {request.images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="provreq-modal-photo-card"
                    onClick={() => onSelectPhoto(img.image_key)}
                    title="Click to view full image"
                  >
                    <img src={img.image_key} alt={`Requirement photo ${idx + 1}`} />
                    <div className="provreq-modal-photo-overlay">
                      <i className="fas fa-search-plus"></i>
                      <span>Inspect</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="provreq-modal-footer">
          <button type="button" className="provreq-btn-subtle" onClick={onClose}>
            Close
          </button>

          <button
            type="button"
            className="provreq-btn-quote"
            onClick={() => {
              onClose();
              onQuote(request);
            }}
          >
            <i className="fas fa-paper-plane mr-1.5"></i>
            <span>Submit Quotation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
