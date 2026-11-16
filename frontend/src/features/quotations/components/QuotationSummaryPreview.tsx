import type { FC } from "react";
import type { QuotationFormData } from "../types/quotation.types";

interface QuotationSummaryPreviewProps {
  quote: Partial<QuotationFormData>;
  providerName?: string;
}

export const QuotationSummaryPreview: FC<QuotationSummaryPreviewProps> = ({
  quote,
  providerName = "You"
}) => {
  const amountFormatted =
    quote.amount && Number(quote.amount) > 0
      ? `₹${Number(quote.amount).toLocaleString("en-IN")}`
      : "₹—";

  const typeLabels: Record<string, { label: string; badgeClass: string }> = {
    FIXED: { label: "Fixed Price", badgeClass: "fixed" },
    ESTIMATED: { label: "Estimated Price", badgeClass: "estimated" },
    INSPECTION_REQUIRED: {
      label: "Inspection Required",
      badgeClass: "inspection"
    }
  };

  const validityLabels: Record<string, string> = {
    "24_HOURS": "Valid for 24 Hours",
    "48_HOURS": "Valid for 48 Hours",
    "3_DAYS": "Valid for 3 Days",
    "7_DAYS": "Valid for 7 Days"
  };

  const typeInfo =
    typeLabels[quote.quotationType || "FIXED"] || typeLabels["FIXED"];

  return (
    <div className="quote-card quote-preview-card">
      <div className="quote-preview-header">
        <span className="quote-preview-label">
          <i className="far fa-eye"></i> Customer Preview
        </span>
        <span className="quote-preview-sub">What customer will see</span>
      </div>

      <div className="quote-preview-body">
        <div className="quote-preview-price-box">
          <div className="quote-preview-price-left">
            <span className="quote-preview-amount">{amountFormatted}</span>
            <span className={`quote-preview-type-pill ${typeInfo.badgeClass}`}>
              {typeInfo.label}
            </span>
          </div>
          <div className="quote-preview-validity">
            <i className="far fa-clock"></i>
            <span>
              {validityLabels[quote.validUntil || "24_HOURS"] || quote.validUntil || "24 Hours"}
            </span>
          </div>
        </div>

        <div className="quote-preview-section">
          <span className="quote-preview-heading">Work Description</span>
          <p className="quote-preview-text">
            {quote.workDescription || "Provide a summary of the work you will perform..."}
          </p>
        </div>

        <div className="quote-preview-lists-grid">
          <div className="quote-preview-list-col">
            <span className="quote-preview-heading included">
              <i className="fas fa-check-circle"></i> Included
            </span>
            <ul className="quote-preview-items">
              {quote.includedItems && quote.includedItems.length > 0 ? (
                quote.includedItems.map((item, idx) => (
                  <li key={idx} className="quote-preview-item-row">
                    <i className="fas fa-check text-green"></i>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="quote-preview-empty">None listed yet</li>
              )}
            </ul>
          </div>

          <div className="quote-preview-list-col">
            <span className="quote-preview-heading excluded">
              <i className="fas fa-times-circle"></i> Not Included
            </span>
            <ul className="quote-preview-items">
              {quote.excludedItems && quote.excludedItems.length > 0 ? (
                quote.excludedItems.map((item, idx) => (
                  <li key={idx} className="quote-preview-item-row">
                    <i className="fas fa-minus text-amber"></i>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="quote-preview-empty">None listed yet</li>
              )}
            </ul>
          </div>
        </div>

        <div className="quote-preview-details-grid">
          <div className="quote-preview-detail-item">
            <span className="quote-detail-k">Duration</span>
            <span className="quote-detail-v">
              <i className="far fa-hourglass"></i>
              {quote.estimatedDuration || "Not specified"}
            </span>
          </div>

          <div className="quote-preview-detail-item">
            <span className="quote-detail-k">Available Time</span>
            <span className="quote-detail-v">
              <i className="far fa-calendar-check"></i>
              {quote.availableDateTime || "Not specified"}
            </span>
          </div>
        </div>

        {quote.extraChargePolicy && (
          <div className="quote-preview-section policy">
            <span className="quote-preview-heading">
              <i className="fas fa-shield-alt"></i> Extra-charge Policy
            </span>
            <p className="quote-preview-policy-text">{quote.extraChargePolicy}</p>
          </div>
        )}

        {quote.messageToCustomer && (
          <div className="quote-preview-section message">
            <span className="quote-preview-heading">
              <i className="far fa-comment-dots"></i> Note from {providerName}
            </span>
            <p className="quote-preview-message-text">"{quote.messageToCustomer}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
