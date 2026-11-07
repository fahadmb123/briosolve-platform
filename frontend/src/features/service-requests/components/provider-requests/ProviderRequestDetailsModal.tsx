import { useState, type FC } from "react";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { calculateDistanceKm, formatDistance } from "../../utils/distance.utils";

interface ProviderRequestDetailsModalProps {
  request: CustomerServiceRequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onQuote: (request: CustomerServiceRequestItem) => void;
  onSelectPhoto: (photoUrl: string) => void;
  onChat?: (request: CustomerServiceRequestItem) => void;
  isChatLoading?: boolean;
}

export const ProviderRequestDetailsModal: FC<ProviderRequestDetailsModalProps> = ({
  request,
  isOpen,
  onClose,
  onQuote,
  onSelectPhoto,
  onChat,
  isChatLoading = false,
}) => {
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [copiedAddress, setCopiedAddress] = useState<boolean>(false);

  const user = useAuthStore((state) => state.user);

  if (!isOpen || !request) return null;

  const copyRequestId = () => {
    navigator.clipboard.writeText(request.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const address = request.address_details;
  const fullAddressString = address
    ? [
        address.house_no,
        address.landmark ? `Near ${address.landmark}` : null,
        address.area,
        address.city,
        address.district,
        address.state,
        address.pincode,
      ]
        .filter(Boolean)
        .join(", ")
    : "Local client service area";

  const copyAddress = () => {
    navigator.clipboard.writeText(fullAddressString);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const providerAddress = user?.current_address_id;
  const providerLat = providerAddress?.latitude != null ? Number(providerAddress.latitude) : null;
  const providerLng = providerAddress?.longitude != null ? Number(providerAddress.longitude) : null;
  const serviceRadiusKm = user?.provider_profile?.service_radius_km ?? 20;

  const reqLat = address?.latitude != null ? Number(address.latitude) : null;
  const reqLng = address?.longitude != null ? Number(address.longitude) : null;

  const computedDistance =
    request.distance_km ??
    (providerLat != null && providerLng != null && reqLat != null && reqLng != null
      ? calculateDistanceKm(providerLat, providerLng, reqLat, reqLng)
      : null);

  const formattedDist = formatDistance(computedDistance);
  const isWithinRadius = computedDistance !== null ? computedDistance <= serviceRadiusKm : true;

  const mapsUrl =
    reqLat != null && reqLng != null
      ? `https://www.google.com/maps/search/?api=1&query=${reqLat},${reqLng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressString)}`;

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

  const customer = request.customer_details;
  const customerInitial = (customer?.name || "Customer").charAt(0).toUpperCase();

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

          {request.status === "CANCELLED" && (
            <div className="provreq-cancelled-callout">
              <i className="fas fa-ban"></i>
              <div>
                <strong>Request Cancelled by Customer</strong>
                <p>This customer has cancelled this service request. Quotations are closed.</p>
              </div>
            </div>
          )}

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
          <div className="provreq-customer-card">
            <div className="provreq-customer-left">
              {customer?.profile_image ? (
                <img
                  src={customer.profile_image}
                  alt={customer.name}
                  className="provreq-customer-avatar-img"
                />
              ) : (
                <div className="provreq-customer-avatar-placeholder">
                  {customerInitial}
                </div>
              )}
              <div className="provreq-customer-meta">
                <div className="provreq-customer-name-row">
                  <span className="provreq-customer-name">
                    {customer?.name || "Customer"}
                  </span>
                  <span className="provreq-customer-verified-tag">
                    <i className="fas fa-check-circle"></i>
                    <span>Verified Customer</span>
                  </span>
                </div>
                <div className="provreq-customer-contacts">
                  {customer?.phone && (
                    <a
                      href={`tel:${customer.phone}`}
                      className="provreq-customer-contact-chip"
                      title="Call customer"
                    >
                      <i className="fas fa-phone-alt"></i>
                      <span>{customer.phone}</span>
                    </a>
                  )}
                  {customer?.email && (
                    <a
                      href={`mailto:${customer.email}`}
                      className="provreq-customer-contact-chip"
                      title="Email customer"
                    >
                      <i className="fas fa-envelope"></i>
                      <span>{customer.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {request.status !== "CANCELLED" && onChat && (
              <button
                type="button"
                className="provreq-customer-chat-btn"
                onClick={() => onChat(request)}
                disabled={isChatLoading}
                title="Send a message to this customer"
              >
                <i className={`fas ${isChatLoading ? "fa-spinner fa-spin" : "fa-comment-dots"}`}></i>
                <span>Message</span>
              </button>
            )}
          </div>

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
              <span>Customer Address & Distance</span>
            </h4>

            <div className={`provreq-distance-banner ${isWithinRadius ? "in-radius" : "out-radius"}`}>
              <div className="provreq-distance-left">
                <div className="provreq-distance-icon-wrap">
                  <i className="fas fa-location-arrow"></i>
                </div>
                <div>
                  <div className="provreq-distance-number-row">
                    <span className="provreq-distance-number">
                      {formattedDist ? `${formattedDist} away` : "Distance estimated upon dispatch"}
                    </span>
                    {computedDistance !== null && (
                      <span className={`provreq-radius-badge ${isWithinRadius ? "badge-success" : "badge-warning"}`}>
                        <i className={`fas ${isWithinRadius ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
                        {isWithinRadius ? `Within your ${serviceRadiusKm} km coverage` : `Beyond ${serviceRadiusKm} km coverage`}
                      </span>
                    )}
                  </div>
                  <p className="provreq-distance-subtext">
                    {providerAddress?.area || providerAddress?.city
                      ? `Calculated from your base: ${[providerAddress.area, providerAddress.city].filter(Boolean).join(", ")}`
                      : "Distance from your profile location"}
                  </p>
                </div>
              </div>
            </div>

            <div className="provreq-address-card">
              <div className="provreq-address-card-header">
                <div className="provreq-address-card-title">
                  <i className="fas fa-home"></i>
                  <span>Service Address Breakdown</span>
                </div>
                <div className="provreq-address-header-actions">
                  <button
                    type="button"
                    className="provreq-btn-address-action"
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
                    className="provreq-btn-address-action maps"
                    title="Open location in Google Maps"
                  >
                    <i className="fas fa-map-marked-alt"></i>
                    <span>Google Maps</span>
                    <i className="fas fa-external-link-alt provreq-ext-icon"></i>
                  </a>
                </div>
              </div>

              <div className="provreq-address-fields-grid">
                <div className="provreq-address-field">
                  <span className="provreq-addr-field-label">House / Flat / Building</span>
                  <span className="provreq-addr-field-val">{address?.house_no || "—"}</span>
                </div>

                <div className="provreq-address-field">
                  <span className="provreq-addr-field-label">Area / Street</span>
                  <span className="provreq-addr-field-val font-semibold">{address?.area || "—"}</span>
                </div>

                <div className="provreq-address-field">
                  <span className="provreq-addr-field-label">Landmark</span>
                  <span className="provreq-addr-field-val">
                    {address?.landmark ? (
                      <span className="provreq-landmark-text">
                        <i className="fas fa-map-pin mr-1 text-amber-500"></i>
                        {address.landmark}
                      </span>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>

                <div className="provreq-address-field">
                  <span className="provreq-addr-field-label">City / Town</span>
                  <span className="provreq-addr-field-val font-semibold">{address?.city || "—"}</span>
                </div>

                <div className="provreq-address-field">
                  <span className="provreq-addr-field-label">District & State</span>
                  <span className="provreq-addr-field-val">
                    {[address?.district, address?.state].filter(Boolean).join(", ") || "—"}
                  </span>
                </div>

                <div className="provreq-address-field">
                  <span className="provreq-addr-field-label">Postal PIN Code</span>
                  <span className="provreq-addr-field-val font-mono">{address?.pincode || "—"}</span>
                </div>
              </div>
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

          {request.status !== "CANCELLED" && onChat && (
            <button
              type="button"
              className="provreq-btn-chat"
              onClick={() => onChat(request)}
              disabled={isChatLoading}
            >
              <i className={`fas ${isChatLoading ? "fa-spinner fa-spin" : "fa-comment-dots"} mr-1.5`}></i>
              <span>{isChatLoading ? "Opening Chat..." : "Chat with Customer"}</span>
            </button>
          )}

          {request.status === "CANCELLED" ? (
            <button type="button" className="provreq-btn-quote disabled" disabled>
              <i className="fas fa-ban mr-1.5"></i>
              <span>Request Cancelled</span>
            </button>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};
