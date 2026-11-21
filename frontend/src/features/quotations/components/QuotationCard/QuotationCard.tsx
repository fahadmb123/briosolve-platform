import type { FC } from "react";
import type { ProviderQuotationItem, QuotationStatus } from "../../types/quotation.types";
import { getCategoryVisualConfig } from "../../../service-requests/utils/categoryIcon.utils";

interface QuotationCardProps {
  quotation: ProviderQuotationItem;
  onViewDetails: (quotation: ProviderQuotationItem) => void;
  onViewRequest: (serviceRequestId: string) => void;
  onEdit?: (quotation: ProviderQuotationItem) => void;
}

const STATUS_CONFIG: Record<QuotationStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "myquote-status-pending" },
  ACCEPTED: { label: "Accepted", className: "myquote-status-accepted" },
  REJECTED: { label: "Rejected", className: "myquote-status-rejected" },
  EXPIRED: { label: "Expired", className: "myquote-status-expired" },
  WITHDRAWN: { label: "Withdrawn", className: "myquote-status-withdrawn" }
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
    day: "numeric",
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

export const QuotationCard: FC<QuotationCardProps> = ({
  quotation,
  onViewDetails,
  onViewRequest,
  onEdit
}) => {
  const statusConfig = STATUS_CONFIG[quotation.status as QuotationStatus] ?? {
    label: quotation.status,
    className: "myquote-status-pending"
  };

  const isExpiredOrWithdrawn =
    quotation.status === "EXPIRED" || quotation.status === "WITHDRAWN";
  const validUntilPassed = new Date(quotation.validUntilDate) < new Date();
  const visual = getCategoryVisualConfig(quotation.categoryName, undefined);

  return (
    <div className={`myquote-row-card ${isExpiredOrWithdrawn ? "dimmed" : ""}`}>
      <div
        className="myquote-row-avatar"
        style={{ backgroundColor: visual.bgColor, color: visual.textColor }}
        onClick={() => onViewDetails(quotation)}
      >
        <i className={visual.icon} />
      </div>

      <div className="myquote-row-center">
        <div className="myquote-row-breadcrumbs">
          <span className="myquote-crumb-category">
            {quotation.categoryName || "Quotation"}
          </span>
          <span className="myquote-crumb-bullet">•</span>
          <span className="myquote-crumb-date">Submitted {formatDate(quotation.createdAt)}</span>
        </div>

        <h3 className="myquote-row-title" onClick={() => onViewDetails(quotation)}>
          {quotation.serviceRequestTitle || "Service Request Proposal"}
        </h3>

        <p className="myquote-row-desc">{quotation.workDescription}</p>

        {(quotation.status === "REJECTED" || quotation.status === "WITHDRAWN") && (
          <div className={`myquote-cancelled-box ${quotation.status.toLowerCase()}`}>
            <div className="myquote-cancelled-header">
              <i className={quotation.status === "REJECTED" ? "fas fa-times-circle" : "fas fa-ban"} />
              <span>
                {quotation.status === "REJECTED"
                  ? "Declined by Customer"
                  : "Withdrawn / Cancelled"}
              </span>
            </div>
            {quotation.rejectionReason && (
              <div className="myquote-cancelled-reason">
                Reason: <strong>"{quotation.rejectionReason}"</strong>
              </div>
            )}
          </div>
        )}

        <div className="myquote-row-meta">
          <div className="myquote-meta-pill">
            <i className="fas fa-tag" />
            <span>{TYPE_LABEL[quotation.quotationType] ?? quotation.quotationType}</span>
          </div>

          <div className="myquote-meta-pill">
            <i className="far fa-clock" />
            <span>
              Valid: {VALIDITY_LABEL[quotation.validUntil] ?? quotation.validUntil}
              {validUntilPassed && quotation.status === "PENDING" && (
                <span className="myquote-expired-tag"> · Validity Passed</span>
              )}
            </span>
          </div>

          {quotation.estimatedDuration && (
            <div className="myquote-meta-pill">
              <i className="fas fa-hourglass-half" />
              <span>{quotation.estimatedDuration}</span>
            </div>
          )}

          {quotation.availableDateTime && (
            <div className="myquote-meta-pill">
              <i className="far fa-calendar-check" />
              <span>{quotation.availableDateTime}</span>
            </div>
          )}

          {quotation.includedItems.length > 0 && (
            <div className="myquote-meta-pill included">
              <i className="fas fa-check" />
              <span>{quotation.includedItems.length} included items</span>
            </div>
          )}
        </div>
      </div>

      <div className="myquote-row-right">
        <div className="myquote-row-header-right">
          <span className={`myquote-badge-pill ${statusConfig.className}`}>
            <span className="myquote-dot-indicator" />
            <span>{statusConfig.label}</span>
          </span>

          <div className="myquote-price-tag">
            <span className="myquote-price-symbol">₹</span>
            <span className="myquote-price-val">
              {formatCurrency(quotation.amount).replace("₹", "").trim()}
            </span>
          </div>
        </div>

        <div className="myquote-row-actions">
          {quotation.status === "PENDING" && onEdit && (
            <button
              type="button"
              className="myquote-btn-edit-inline"
              onClick={() => onEdit(quotation)}
              title="Edit quotation"
            >
              <i className="fas fa-edit" />
              <span>Edit</span>
            </button>
          )}

          <button
            type="button"
            className="myquote-btn-view-details"
            onClick={() => onViewDetails(quotation)}
            title="View quotation details"
          >
            <span>View Details</span>
          </button>

          <button
            type="button"
            className="myquote-btn-open-request"
            onClick={() => onViewRequest(quotation.serviceRequestId)}
            title="Open related service request"
          >
            <span>View Request</span>
            <i className="fas fa-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationCard;
