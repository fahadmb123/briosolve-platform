import type { FC } from "react";
import type { CustomerServiceRequestItem } from "../../service-requests/types/serviceRequest.types";

interface RequestBriefCardProps {
  request: CustomerServiceRequestItem | null;
  onSelectPhoto?: (url: string) => void;
}

export const RequestBriefCard: FC<RequestBriefCardProps> = ({
  request,
  onSelectPhoto
}) => {
  if (!request) {
    return (
      <div className="quote-sidebar-card">
        <div className="quote-sidebar-header">
          <h3 className="quote-sidebar-title">Request Details</h3>
        </div>
        <div className="quote-sidebar-body">
          <p className="quote-empty-text">Loading request details...</p>
        </div>
      </div>
    );
  }

  const urgencyLabels: Record<string, string> = {
    TODAY: "Today",
    THIS_WEEK: "This Week",
    SPECIFIC_DATE: "Specific Date",
    FLEXIBLE: "Flexible"
  };

  const address = request.address_details;
  const locationString = [
    address?.house_no,
    address?.area,
    address?.city
  ]
    .filter(Boolean)
    .join(", ") || "Location details provided";

  return (
    <div className="quote-sidebar-card">
      <div className="quote-sidebar-header">
        <div className="quote-header-tag-row">
          <span className="quote-sidebar-badge category">
            {request.category_name || "Service"}
          </span>
          {request.subservice_name && (
            <span className="quote-sidebar-badge subservice">
              {request.subservice_name}
            </span>
          )}
          <span className="quote-sidebar-badge urgency">
            {urgencyLabels[request.urgency] || request.urgency}
          </span>
        </div>
        <h3 className="quote-sidebar-title">{request.title}</h3>
      </div>

      <div className="quote-sidebar-body">
        <div className="quote-details-list">
          <div className="quote-detail-row">
            <span className="quote-detail-label">Customer</span>
            <span className="quote-detail-value">
              {request.customer_details?.name || "Customer"}
            </span>
          </div>

          <div className="quote-detail-row">
            <span className="quote-detail-label">Location</span>
            <span className="quote-detail-value" title={locationString}>
              {address?.area ? `${address.area}, ${address.city}` : locationString}
            </span>
          </div>

          <div className="quote-detail-row">
            <span className="quote-detail-label">Preferred Time</span>
            <span className="quote-detail-value">
              {request.available_time_from && request.available_time_to
                ? `${request.available_time_from} - ${request.available_time_to}`
                : "Flexible"}
            </span>
          </div>

          {request.distance_km !== undefined && request.distance_km !== null && (
            <div className="quote-detail-row">
              <span className="quote-detail-label">Distance</span>
              <span className="quote-detail-value">
                {request.distance_km < 1 ? "< 1 km away" : `${request.distance_km.toFixed(1)} km away`}
              </span>
            </div>
          )}
        </div>

        <div className="quote-sidebar-section">
          <span className="quote-section-label">Customer Description</span>
          <p className="quote-customer-desc">{request.description}</p>
        </div>

        {request.answers && request.answers.length > 0 && (
          <div className="quote-sidebar-section">
            <span className="quote-section-label">Additional Details</span>
            <div className="quote-answers-grid">
              {request.answers.map((ans) => (
                <div key={ans.question_id} className="quote-answer-item">
                  <span className="quote-answer-label">{ans.question_label}</span>
                  <span className="quote-answer-value">
                    {Array.isArray(ans.answer) ? ans.answer.join(", ") : String(ans.answer)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {request.images && request.images.length > 0 && (
          <div className="quote-sidebar-section">
            <span className="quote-section-label">
              Attached Photos ({request.images.length})
            </span>
            <div className="quote-photos-grid">
              {request.images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="quote-photo-thumbnail"
                  onClick={() => onSelectPhoto && onSelectPhoto(img.image_key)}
                >
                  <img src={img.image_key} alt={`Attachment ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
