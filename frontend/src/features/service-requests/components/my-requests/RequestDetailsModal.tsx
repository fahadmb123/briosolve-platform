import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";
import { checkRequestEditPermission } from "../../utils/serviceRequestEdit.utils";

interface RequestDetailsModalProps {
  request: CustomerServiceRequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEditRequest: (request: CustomerServiceRequestItem) => void;
  onCancelRequest: (request: CustomerServiceRequestItem) => void;
  onReopenRequest?: (request: CustomerServiceRequestItem) => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
  request,
  isOpen,
  onClose,
  onEditRequest,
  onCancelRequest,
  onReopenRequest,
}) => {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  const isDiagnosisClosed = Boolean(
    request.status === "CLOSED" ||
    request.latest_booking?.status === "CLOSED" ||
    request.latest_booking?.is_diagnosis_closed ||
    (request.latest_booking?.cancellation_reason &&
     request.latest_booking.cancellation_reason.toLowerCase().includes("diagnosis"))
  );

  const canCancel = (request.status === "PENDING" || request.status === "ACTIVE") && !isDiagnosisClosed;
  const permission = checkRequestEditPermission(request);

  const formattedDate = new Date(request.created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getUrgencyText = () => {
    if (request.status === "EXPIRED") {
      return "Expired";
    }
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
    if (request.latest_booking?.status === "COMPLETED" || isDiagnosisClosed) {
      return "completed";
    }
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
      case "CLOSED":
        return "completed";
      case "CANCELLED":
        return "cancelled";
      case "EXPIRED":
        return "expired";
      default:
        return "default";
    }
  };

  const displayStatus = isDiagnosisClosed
    ? "Diagnosis Closed"
    : request.latest_booking?.status === "COMPLETED"
    ? "Completed"
    : request.status.replace("_", " ");

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

              <span
                className={`myreq-status-pill ${getStatusVariant(request.status)}`}
                style={isDiagnosisClosed ? { background: "#ecfdf5", color: "#065f46", border: "1px solid #a7f3d0" } : undefined}
              >
                <span className="myreq-status-dot" style={isDiagnosisClosed ? { background: "#10b981" } : undefined}></span>
                <span>{displayStatus}</span>
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

          {request.answers && request.answers.length > 0 && (
            <div className="myreq-modal-block">
              <h4 className="myreq-block-heading">Service Specifications</h4>
              <div className="myreq-key-value-list">
                {request.answers.map((ans, idx) => (
                  <div key={ans.question_id || idx} className="myreq-kv-item">
                    <span className="myreq-kv-key">{ans.question_label}</span>
                    <span className="myreq-kv-val">
                      {Array.isArray(ans.answer)
                        ? ans.answer.join(", ")
                        : typeof ans.answer === "boolean"
                        ? ans.answer ? "Yes" : "No"
                        : String(ans.answer ?? "")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {request.latest_booking && (
            <div className="myreq-modal-block">
              <h4 className="myreq-block-heading">Booking Information</h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.875rem 1rem",
                  background: (request.latest_booking.status === "COMPLETED" || isDiagnosisClosed) ? "#f0fdf4" : "#f8fafc",
                  border: (request.latest_booking.status === "COMPLETED" || isDiagnosisClosed) ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
                  borderRadius: "8px"
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.875rem" }}>
                    Booking #{request.latest_booking.booking_number}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: (request.latest_booking.status === "COMPLETED" || isDiagnosisClosed) ? "#16a34a" : "#64748b", marginTop: "2px" }}>
                    Status: <strong>{isDiagnosisClosed ? "Diagnosis Closed" : request.latest_booking.status.replace("_", " ")}</strong>
                    {request.latest_booking.total_amount > 0 && ` • ₹${request.latest_booking.total_amount.toLocaleString("en-IN")}`}
                  </div>
                </div>
                <button
                  type="button"
                  className="myreq-btn-subtle"
                  style={{ padding: "0.4rem 0.85rem", fontSize: "0.8125rem" }}
                  onClick={() => {
                    onClose();
                    navigate(`/bookings/${request.latest_booking?.id}`);
                  }}
                >
                  <i className="fas fa-external-link-alt" style={{ marginRight: "4px" }}></i>
                  <span>View Booking</span>
                </button>
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
          {request.latest_booking?.id && (
            <button
              type="button"
              className="myreq-btn-subtle"
              onClick={() => {
                onClose();
                navigate(`/bookings/${request.latest_booking?.id}`);
              }}
              style={{
                color: (request.latest_booking.status === "COMPLETED" || isDiagnosisClosed) ? "#15803d" : "#c2410c",
                fontWeight: 600
              }}
            >
              <i className="fas fa-receipt" style={{ marginRight: "4px" }}></i>
              <span>{isDiagnosisClosed ? "View Diagnosis Booking" : (request.latest_booking.status === "COMPLETED" ? "View Completed Booking" : "View Booking")}</span>
            </button>
          )}
          {request.status === "EXPIRED" && !isDiagnosisClosed && onReopenRequest && (
            <button
              type="button"
              className="myreq-btn-reopen"
              onClick={() => {
                onClose();
                onReopenRequest(request);
              }}
            >
              <i className="fas fa-redo-alt"></i>
              <span>Reopen Request</span>
            </button>
          )}

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
