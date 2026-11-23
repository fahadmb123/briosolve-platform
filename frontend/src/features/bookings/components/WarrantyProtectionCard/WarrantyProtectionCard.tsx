import React from "react";
import type { BookingItem } from "../../types/booking.types";
import "./WarrantyProtectionCard.css";

interface WarrantyProtectionCardProps {
  booking: BookingItem;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  onRequestClaim: () => void;
  onProviderAction: (mode: "ACCEPT" | "REJECT" | "RESOLVE") => void;
}

export const WarrantyProtectionCard: React.FC<WarrantyProtectionCardProps> = ({
  booking,
  role,
  onRequestClaim,
  onProviderAction
}) => {
  const warranty = booking.warranty;
  if (!warranty || !warranty.days || warranty.days <= 0) {
    return null;
  }

  const claim = warranty.claim;
  const expiresAtDate = warranty.expiresAt ? new Date(warranty.expiresAt) : null;
  const isExpired = expiresAtDate ? expiresAtDate.getTime() < Date.now() : false;
  const daysRemaining = expiresAtDate
    ? Math.max(0, Math.ceil((expiresAtDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : warranty.days;

  const formatDate = (isoStr?: string | null) => {
    if (!isoStr) return "";
    try {
      return new Date(isoStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className={`warranty-card ${claim ? `warranty-card-${claim.status.toLowerCase()}` : isExpired ? "warranty-card-expired" : "warranty-card-active"}`}>
      <div className="warranty-card-header">
        <div className="warranty-card-title-group">
          <div className="warranty-badge-icon">
            {claim?.status === "PENDING" && <i className="fas fa-clock" />}
            {claim?.status === "ACCEPTED" && <i className="fas fa-calendar-check" />}
            {claim?.status === "REJECTED" && <i className="fas fa-balance-scale" />}
            {claim?.status === "RESOLVED" && <i className="fas fa-check-double" />}
            {!claim && !isExpired && <i className="fas fa-shield-alt" />}
            {!claim && isExpired && <i className="fas fa-shield-virus" />}
          </div>
          <div>
            <div className="warranty-status-pill">
              {claim?.status === "PENDING" && "Warranty Claim Under Review"}
              {claim?.status === "ACCEPTED" && "Free Re-visit Confirmed"}
              {claim?.status === "REJECTED" && "Claim Disputed • Admin Investigation"}
              {claim?.status === "RESOLVED" && "Warranty Re-visit Resolved"}
              {!claim && !isExpired && `Active Warranty • ${daysRemaining} Days Left`}
              {!claim && isExpired && "Warranty Period Expired"}
            </div>
            <h4 className="warranty-main-title">
              {claim?.status === "PENDING" && "Customer Reported a Service Issue"}
              {claim?.status === "ACCEPTED" && "Technician Re-visit Scheduled"}
              {claim?.status === "REJECTED" && "Disputed & Escalated to Admin Support"}
              {claim?.status === "RESOLVED" && "Warranty Re-work Completed"}
              {!claim && !isExpired && `${warranty.days}-Day Service Guarantee Active`}
              {!claim && isExpired && `${warranty.days}-Day Service Guarantee`}
            </h4>
          </div>
        </div>

        {!claim && !isExpired && role === "CUSTOMER" && (
          <button
            type="button"
            className="warranty-btn-claim"
            onClick={onRequestClaim}
          >
            <i className="fas fa-exclamation-triangle" /> Report Issue Under Warranty
          </button>
        )}
      </div>

      <div className="warranty-card-body">
        {!claim && (
          <div className="warranty-info-grid">
            <div className="warranty-info-item">
              <span className="warranty-info-label">Valid Until</span>
              <span className="warranty-info-val">{formatDate(warranty.expiresAt)}</span>
            </div>
            <div className="warranty-info-item">
              <span className="warranty-info-label">Coverage Terms</span>
              <span className="warranty-info-val">
                {warranty.terms || "Free inspection and re-work on previously serviced parts."}
              </span>
            </div>
            <div className="warranty-info-item">
              <span className="warranty-info-label">Protection Fee</span>
              <span className="warranty-info-val free-highlight">₹0 Free Guarantee</span>
            </div>
          </div>
        )}

        {claim && (
          <div className="warranty-claim-details">
            <div className="warranty-claim-field">
              <span className="warranty-claim-lbl">Reported Problem:</span>
              <p className="warranty-claim-desc">"{claim.issueDescription}"</p>
            </div>

            {claim.proofImages && claim.proofImages.length > 0 && (
              <div className="warranty-claim-field">
                <span className="warranty-claim-lbl">Customer Photo Proof:</span>
                <div className="warranty-claim-photos">
                  {claim.proofImages.map((img, i) => (
                    <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                      <img src={img} alt={`Proof ${i + 1}`} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {claim.status === "PENDING" && (
              <div className="warranty-claim-grid">
                <div className="warranty-claim-field">
                  <span className="warranty-claim-lbl">Customer Preferred Slot:</span>
                  <span className="warranty-claim-val">
                    {claim.preferredDate ? `${claim.preferredDate} ${claim.preferredTime ? `(${claim.preferredTime})` : ""}` : "Any available slot"}
                  </span>
                </div>
                <div className="warranty-claim-field">
                  <span className="warranty-claim-lbl">Reported On:</span>
                  <span className="warranty-claim-val">{formatDate(claim.reportedAt)}</span>
                </div>
              </div>
            )}

            {claim.status === "ACCEPTED" && (
              <div className="warranty-scheduled-box">
                <div className="warranty-sched-main">
                  <i className="fas fa-calendar-alt" />
                  <div>
                    <strong>Confirmed Re-visit: {claim.revisitScheduledDate}</strong>
                    {claim.revisitScheduledTime && <span> • {claim.revisitScheduledTime}</span>}
                  </div>
                </div>
                {claim.providerResponse && (
                  <p className="warranty-prov-msg">
                    <strong>Technician Note:</strong> {claim.providerResponse}
                  </p>
                )}
              </div>
            )}

            {claim.status === "REJECTED" && (
              <div className="warranty-disputed-box">
                <div className="warranty-dispute-header">
                  <i className="fas fa-gavel" />
                  <strong>Provider Rationale for Dispute:</strong>
                </div>
                <p className="warranty-dispute-reason">"{claim.rejectionReason}"</p>
                <div className="warranty-dispute-admin-note">
                  <i className="fas fa-info-circle" />
                  <span>
                    Our Admin Support Team has been notified and is investigating the dispute against original service photos and technician notes.
                  </span>
                </div>
              </div>
            )}

            {claim.status === "RESOLVED" && (
              <div className="warranty-resolved-box">
                <i className="fas fa-check-circle" />
                <span>
                  Corrective warranty work has been completed on {formatDate(claim.resolvedAt || claim.reportedAt)}.
                </span>
              </div>
            )}
          </div>
        )}

        {role === "PROVIDER" && claim?.status === "PENDING" && (
          <div className="warranty-provider-actions">
            <button
              type="button"
              className="warranty-btn-accept"
              onClick={() => onProviderAction("ACCEPT")}
            >
              <i className="fas fa-calendar-check" /> Accept & Schedule Free Re-visit
            </button>
            <button
              type="button"
              className="warranty-btn-dispute"
              onClick={() => onProviderAction("REJECT")}
            >
              <i className="fas fa-balance-scale" /> Dispute / Reject Claim
            </button>
          </div>
        )}

        {role === "PROVIDER" && claim?.status === "ACCEPTED" && (
          <div className="warranty-provider-actions">
            <button
              type="button"
              className="warranty-btn-accept"
              onClick={() => onProviderAction("RESOLVE")}
            >
              <i className="fas fa-check-circle" /> Mark Re-visit Resolved
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
