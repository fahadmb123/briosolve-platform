import type { ProviderQuotationItem, QuotationStatus } from "../../types/quotation.types";

interface QuotationCardProps {
  quotation: ProviderQuotationItem;
  onViewRequest: (serviceRequestId: string) => void;
}

const STATUS_CONFIG: Record<QuotationStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "myquote-badge-pending" },
  ACCEPTED: { label: "Accepted", className: "myquote-badge-accepted" },
  REJECTED: { label: "Rejected", className: "myquote-badge-rejected" },
  EXPIRED: { label: "Expired", className: "myquote-badge-expired" },
  WITHDRAWN: { label: "Withdrawn", className: "myquote-badge-withdrawn" }
};

const TYPE_LABEL: Record<string, string> = {
  FIXED: "Fixed Price",
  ESTIMATED: "Estimated Price",
  INSPECTION_REQUIRED: "Inspection Required"
};

const VALIDITY_LABEL: Record<string, string> = {
  HOURS_24: "24 Hours",
  HOURS_48: "48 Hours",
  DAYS_3: "3 Days",
  DAYS_7: "7 Days"
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export default function QuotationCard({ quotation, onViewRequest }: QuotationCardProps) {
  const statusConfig = STATUS_CONFIG[quotation.status as QuotationStatus] ?? { label: quotation.status, className: "myquote-badge-pending" };
  const isExpiredOrWithdrawn = quotation.status === "EXPIRED" || quotation.status === "WITHDRAWN";
  const validUntilPassed = new Date(quotation.validUntilDate) < new Date();

  return (
    <div className={`myquote-card ${isExpiredOrWithdrawn ? "myquote-card-dimmed" : ""}`}>
      <div className="myquote-card-top">
        <div className="myquote-card-left">
          <div className="myquote-amount-badge">
            <span className="myquote-currency-sym">₹</span>
            <span className="myquote-amount-val">{formatCurrency(quotation.amount).replace("₹", "").trim()}</span>
          </div>
          <div className="myquote-type-pill">
            <i className="fas fa-tag myquote-type-icon" />
            <span>{TYPE_LABEL[quotation.quotationType] ?? quotation.quotationType}</span>
          </div>
        </div>

        <div className="myquote-card-right">
          <span className={`myquote-status-badge ${statusConfig.className}`}>
            <span className="myquote-status-dot" />
            <span>{statusConfig.label}</span>
          </span>
        </div>
      </div>

      {quotation.serviceRequestTitle && (
        <div className="myquote-request-title">
          <i className="fas fa-clipboard-list myquote-req-icon" />
          <span>{quotation.serviceRequestTitle}</span>
        </div>
      )}

      <p className="myquote-work-desc">{quotation.workDescription}</p>

      <div className="myquote-meta-row">
        <div className="myquote-meta-item">
          <i className="fas fa-calendar-alt myquote-meta-icon" />
          <span>Submitted {formatDate(quotation.createdAt)}</span>
        </div>
        <div className="myquote-meta-item">
          <i className="fas fa-clock myquote-meta-icon" />
          <span>
            Valid for {VALIDITY_LABEL[quotation.validUntil] ?? quotation.validUntil}
            {validUntilPassed && quotation.status === "PENDING" && (
              <span className="myquote-expired-hint"> · Validity passed</span>
            )}
          </span>
        </div>
        {quotation.estimatedDuration && (
          <div className="myquote-meta-item">
            <i className="fas fa-hourglass-half myquote-meta-icon" />
            <span>{quotation.estimatedDuration}</span>
          </div>
        )}
        {quotation.availableDateTime && (
          <div className="myquote-meta-item">
            <i className="fas fa-calendar-check myquote-meta-icon" />
            <span>{quotation.availableDateTime}</span>
          </div>
        )}
      </div>

      <div className="myquote-tags-row">
        {quotation.includedItems.slice(0, 3).map((item, i) => (
          <span key={i} className="myquote-included-tag">
            <i className="fas fa-check myquote-tag-icon" />
            {item}
          </span>
        ))}
        {quotation.includedItems.length > 3 && (
          <span className="myquote-more-tag">+{quotation.includedItems.length - 3} more</span>
        )}
      </div>

      <div className="myquote-card-footer">
        <button
          type="button"
          className="myquote-btn-view-request"
          onClick={() => onViewRequest(quotation.serviceRequestId)}
        >
          <i className="fas fa-external-link-alt" />
          <span>View Request</span>
        </button>
      </div>
    </div>
  );
}
