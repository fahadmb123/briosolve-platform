import type { FC } from "react";
import type { CustomerServiceRequestItem } from "../../service-requests/types/serviceRequest.types";
import "./RequestBriefCard.css";

interface RequestBriefCardProps {
  request: CustomerServiceRequestItem | null;
  onSelectPhoto?: (url: string) => void;
  onChat?: () => void;
}

export const RequestBriefCard: FC<RequestBriefCardProps> = ({
  request,
  onSelectPhoto,
  onChat
}) => {
  if (!request) {
    return (
      <div className="quote-sidebar-card">
        <div className="quote-sidebar-skeleton">
          <div className="quote-sidebar-sk-header">
            <div className="quote-sk-shimmer quote-sidebar-sk-badge" />
            <div className="quote-sk-shimmer quote-sidebar-sk-chat-btn" />
          </div>

          <div className="quote-sk-shimmer quote-sidebar-sk-title" />

          <div className="quote-sidebar-sk-meta">
            <div className="quote-sidebar-sk-meta-row">
              <div className="quote-sk-shimmer quote-sidebar-sk-meta-label" />
              <div className="quote-sk-shimmer quote-sidebar-sk-meta-val" />
            </div>
            <div className="quote-sidebar-sk-meta-row">
              <div className="quote-sk-shimmer quote-sidebar-sk-meta-label" />
              <div className="quote-sk-shimmer quote-sidebar-sk-meta-val" />
            </div>
            <div className="quote-sidebar-sk-meta-row">
              <div className="quote-sk-shimmer quote-sidebar-sk-meta-label" />
              <div className="quote-sk-shimmer quote-sidebar-sk-meta-val" />
            </div>
          </div>

          <div className="quote-sidebar-sk-desc-block">
            <div className="quote-sk-shimmer quote-sidebar-sk-section-title" />
            <div className="quote-sk-shimmer quote-sidebar-sk-box" />
          </div>

          <div className="quote-sidebar-sk-answers">
            <div className="quote-sk-shimmer quote-sidebar-sk-section-title" />
            <div className="quote-sk-shimmer quote-sidebar-sk-answer-row" />
            <div className="quote-sk-shimmer quote-sidebar-sk-answer-row" />
          </div>

          <div className="quote-sidebar-sk-photos">
            <div className="quote-sk-shimmer quote-sidebar-sk-photo-box" />
            <div className="quote-sk-shimmer quote-sidebar-sk-photo-box" />
          </div>
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
            <div className="quote-customer-col">
              <span className="quote-detail-value">
                {request.customer_details?.name || "Customer"}
              </span>
              {onChat && (
                <button
                  type="button"
                  className="quote-chat-link-btn"
                  onClick={onChat}
                  title="Chat with Customer"
                >
                  <i className="fas fa-comment-dots"></i>
                  <span>Chat</span>
                </button>
              )}
            </div>
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
              {request.urgency === "SPECIFIC_DATE" && request.specific_date
                ? new Date(request.specific_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })
                : urgencyLabels[request.urgency] || request.urgency}
              {request.available_time_from && request.available_time_to && (
                <span> ({request.available_time_from} - {request.available_time_to})</span>
              )}
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

        {request.description && (
          <div className="quote-sidebar-section">
            <span className="quote-section-label">Customer Description</span>
            <p className="quote-customer-desc">{request.description}</p>
          </div>
        )}

        {request.answers && request.answers.length > 0 && (
          <div className="quote-sidebar-section">
            <span className="quote-section-label">Additional Details</span>
            <div className="quote-answers-grid">
              {request.answers.map((ans, idx) => (
                <div key={ans.question_id || idx} className="quote-answer-item">
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
