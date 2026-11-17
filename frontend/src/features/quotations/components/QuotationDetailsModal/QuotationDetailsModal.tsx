import type { FC } from "react";
import type { ProviderQuotationItem, QuotationStatus } from "../../types/quotation.types";
import "./QuotationDetailsModal.css";

interface QuotationDetailsModalProps {
  quotation: ProviderQuotationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onViewRequest: (serviceRequestId: string) => void;
  onEdit?: (quotation: ProviderQuotationItem) => void;
}

const STATUS_CONFIG: Record<QuotationStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "quote-modal-badge-pending" },
  ACCEPTED: { label: "Accepted", className: "quote-modal-badge-accepted" },
  REJECTED: { label: "Rejected", className: "quote-modal-badge-rejected" },
  EXPIRED: { label: "Expired", className: "quote-modal-badge-expired" },
  WITHDRAWN: { label: "Withdrawn", className: "quote-modal-badge-withdrawn" }
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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export const QuotationDetailsModal: FC<QuotationDetailsModalProps> = ({
  quotation,
  isOpen,
  onClose,
  onViewRequest,
  onEdit
}) => {
  if (!isOpen || !quotation) return null;

  const statusConfig = STATUS_CONFIG[quotation.status as QuotationStatus] ?? {
    label: quotation.status,
    className: "quote-modal-badge-pending"
  };

  const validUntilPassed = new Date(quotation.validUntilDate) < new Date();

  return (
    <div className="quote-modal-backdrop" onClick={onClose}>
      <div className="quote-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="quote-modal-header">
          <div className="quote-modal-header-left">
            <span className={`quote-modal-status ${statusConfig.className}`}>
              <span className="quote-modal-status-dot" />
              <span>{statusConfig.label}</span>
            </span>
            <span className="quote-modal-id">ID: {quotation.id.slice(0, 8)}...</span>
          </div>

          <button
            type="button"
            className="quote-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="quote-modal-body">
          <div className="quote-modal-highlight-box">
            <div className="quote-modal-highlight-amount">
              <span className="quote-modal-currency">₹</span>
              <span className="quote-modal-amount-val">
                {formatCurrency(quotation.amount).replace("₹", "").trim()}
              </span>
            </div>
            <div className="quote-modal-type-tag">
              <i className="fas fa-tag" />
              <span>{TYPE_LABEL[quotation.quotationType] ?? quotation.quotationType}</span>
            </div>
          </div>

          {quotation.serviceRequestTitle && (
            <div className="quote-modal-section">
              <div className="quote-modal-section-label">REQUEST TITLE</div>
              <h3 className="quote-modal-request-title">{quotation.serviceRequestTitle}</h3>
            </div>
          )}

          <div className="quote-modal-section">
            <div className="quote-modal-section-label">WORK DESCRIPTION</div>
            <p className="quote-modal-text">{quotation.workDescription}</p>
          </div>

          <div className="quote-modal-grid-two">
            <div className="quote-modal-section">
              <div className="quote-modal-section-label">WHAT'S INCLUDED</div>
              <ul className="quote-modal-items-list included">
                {quotation.includedItems.map((item, idx) => (
                  <li key={idx}>
                    <i className="fas fa-check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="quote-modal-section">
              <div className="quote-modal-section-label">WHAT'S EXCLUDED</div>
              <ul className="quote-modal-items-list excluded">
                {quotation.excludedItems.map((item, idx) => (
                  <li key={idx}>
                    <i className="fas fa-times" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="quote-modal-section">
            <div className="quote-modal-section-label">SCHEDULE & VALIDITY</div>
            <div className="quote-modal-meta-grid">
              <div className="quote-modal-meta-block">
                <i className="fas fa-hourglass-half" />
                <div>
                  <div className="quote-modal-meta-title">Estimated Duration</div>
                  <div className="quote-modal-meta-value">
                    {quotation.estimatedDuration || "Not specified"}
                  </div>
                </div>
              </div>

              <div className="quote-modal-meta-block">
                <i className="fas fa-calendar-check" />
                <div>
                  <div className="quote-modal-meta-title">Available Date / Time</div>
                  <div className="quote-modal-meta-value">
                    {quotation.availableDateTime || "Flexible"}
                  </div>
                </div>
              </div>

              <div className="quote-modal-meta-block">
                <i className="fas fa-clock" />
                <div>
                  <div className="quote-modal-meta-title">Validity</div>
                  <div className="quote-modal-meta-value">
                    {VALIDITY_LABEL[quotation.validUntil] ?? quotation.validUntil}
                    {validUntilPassed && quotation.status === "PENDING" && (
                      <span className="quote-modal-expired-tag">Expired</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="quote-modal-meta-block">
                <i className="fas fa-calendar-alt" />
                <div>
                  <div className="quote-modal-meta-title">Submitted At</div>
                  <div className="quote-modal-meta-value">{formatDate(quotation.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>

          {quotation.extraChargePolicy && (
            <div className="quote-modal-section">
              <div className="quote-modal-section-label">EXTRA CHARGE POLICY</div>
              <div className="quote-modal-policy-box">
                <i className="fas fa-info-circle" />
                <span>{quotation.extraChargePolicy}</span>
              </div>
            </div>
          )}
        </div>

        <div className="quote-modal-footer">
          {quotation.status === "PENDING" && onEdit && (
            <button
              type="button"
              className="quote-modal-btn-edit"
              onClick={() => {
                onClose();
                onEdit(quotation);
              }}
            >
              <i className="fas fa-edit" />
              <span>Edit Quotation</span>
            </button>
          )}

          <button
            type="button"
            className="quote-modal-btn-view-req"
            onClick={() => {
              onClose();
              onViewRequest(quotation.serviceRequestId);
            }}
          >
            <i className="fas fa-external-link-alt" />
            <span>Open Service Request</span>
          </button>
          <button type="button" className="quote-modal-btn-dismiss" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
