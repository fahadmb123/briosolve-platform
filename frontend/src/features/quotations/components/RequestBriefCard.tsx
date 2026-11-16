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
      <div className="quote-card quote-brief-card quote-brief-loading">
        <div className="quote-brief-skeleton">
          <div className="quote-skeleton-line title" />
          <div className="quote-skeleton-line text" />
          <div className="quote-skeleton-line short" />
        </div>
      </div>
    );
  }

  const urgencyLabels: Record<string, string> = {
    TODAY: "Today / Urgent",
    THIS_WEEK: "This Week",
    SPECIFIC_DATE: "Specific Date",
    FLEXIBLE: "Flexible"
  };

  const address = request.address_details;
  const addressText = [
    address?.house_no,
    address?.area,
    address?.city,
    address?.state
  ]
    .filter(Boolean)
    .join(", ") || "Location details provided";

  return (
    <div className="quote-card quote-brief-card">
      <div className="quote-brief-header">
        <div className="quote-brief-badges">
          <span className="quote-tag quote-category-tag">
            <i className="fas fa-tag"></i>
            {request.category_name || "Service Request"}
          </span>
          {request.subservice_name && (
            <span className="quote-tag quote-subservice-tag">
              {request.subservice_name}
            </span>
          )}
          <span className="quote-tag quote-urgency-tag">
            <i className="far fa-clock"></i>
            {urgencyLabels[request.urgency] || request.urgency}
          </span>
        </div>
        <h3 className="quote-brief-title">{request.title}</h3>
      </div>

      <div className="quote-brief-meta-grid">
        <div className="quote-brief-meta-item">
          <span className="quote-meta-label">Customer</span>
          <span className="quote-meta-val">
            <i className="fas fa-user-circle"></i>
            {request.customer_details?.name || "Customer"}
          </span>
        </div>

        <div className="quote-brief-meta-item">
          <span className="quote-meta-label">Service Area</span>
          <span className="quote-meta-val" title={addressText}>
            <i className="fas fa-map-marker-alt"></i>
            {address?.area ? `${address.area}, ${address.city}` : addressText}
          </span>
        </div>

        <div className="quote-brief-meta-item">
          <span className="quote-meta-label">Schedule Window</span>
          <span className="quote-meta-val">
            <i className="far fa-calendar-alt"></i>
            {request.available_time_from && request.available_time_to
              ? `${request.available_time_from} - ${request.available_time_to}`
              : "Flexible hours"}
          </span>
        </div>

        {request.distance_km !== undefined && request.distance_km !== null && (
          <div className="quote-brief-meta-item">
            <span className="quote-meta-label">Distance</span>
            <span className="quote-meta-val">
              <i className="fas fa-location-arrow"></i>
              {request.distance_km < 1 ? "< 1 km away" : `${request.distance_km.toFixed(1)} km away`}
            </span>
          </div>
        )}
      </div>

      <div className="quote-brief-desc-box">
        <span className="quote-meta-label">Customer's Scope & Requirements:</span>
        <p className="quote-brief-desc-text">{request.description}</p>
      </div>

      {request.answers && request.answers.length > 0 && (
        <div className="quote-brief-answers-box">
          <span className="quote-meta-label">Customer Answers:</span>
          <div className="quote-brief-answers-list">
            {request.answers.map((ans) => (
              <div key={ans.question_id} className="quote-answer-pill">
                <span className="quote-answer-q">{ans.question_label}:</span>
                <span className="quote-answer-a">
                  {Array.isArray(ans.answer) ? ans.answer.join(", ") : String(ans.answer)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {request.images && request.images.length > 0 && (
        <div className="quote-brief-photos">
          <span className="quote-meta-label">Attached Photos ({request.images.length})</span>
          <div className="quote-brief-gallery">
            {request.images.map((img, idx) => (
              <div
                key={img.id || idx}
                className="quote-gallery-item"
                onClick={() => onSelectPhoto && onSelectPhoto(img.image_key)}
              >
                <img src={img.image_key} alt={`Attached ${idx + 1}`} />
                <div className="quote-gallery-overlay">
                  <i className="fas fa-search-plus"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
