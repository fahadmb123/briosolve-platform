import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useGetRequestQuotations,
  useAcceptQuotation,
  useRejectQuotation
} from "../../../quotations/hooks/useQuotationMutations";
import type { RequestQuotationItem } from "../../../quotations/types/quotation.types";
import "./RequestQuotations.css";

export interface RequestQuotationsProps {
  requestId: string;
  requestStatus?: string;
  onQuotationAccepted?: () => void;
}

export const RequestQuotations: React.FC<RequestQuotationsProps> = ({
  requestId,
  requestStatus,
  onQuotationAccepted
}) => {
  const navigate = useNavigate();
  const { data: responseData, isLoading, error, refetch } = useGetRequestQuotations(requestId);
  const acceptMutation = useAcceptQuotation();
  const rejectMutation = useRejectQuotation();

  const [confirmAcceptQuote, setConfirmAcceptQuote] = useState<RequestQuotationItem | null>(null);
  const [confirmRejectQuote, setConfirmRejectQuote] = useState<RequestQuotationItem | null>(null);

  const quotations: RequestQuotationItem[] = responseData?.data?.quotations || [];
  const acceptedQuoteId = responseData?.data?.acceptedQuotationId;
  const isRequestClosed =
    requestStatus === "CANCELLED" ||
    requestStatus === "EXPIRED" ||
    requestStatus === "COMPLETED";

  const handleChat = (quote: RequestQuotationItem) => {
    if (!quote.provider.userId) {
      toast.error("Provider messaging unavailable");
      return;
    }

    navigate(`/customer/messages?recipientId=${quote.provider.userId}`, {
      state: {
        recipientId: quote.provider.userId,
        recipientName: quote.provider.businessName || quote.provider.name,
        requestId: quote.serviceRequestId,
        requestTitle: "Service Quotation"
      }
    });
  };

  const handleConfirmAccept = () => {
    if (!confirmAcceptQuote) return;

    acceptMutation.mutate(confirmAcceptQuote.id, {
      onSuccess: () => {
        toast.success(`Accepted quotation from ${confirmAcceptQuote.provider.businessName}!`);
        setConfirmAcceptQuote(null);
        refetch();
        onQuotationAccepted?.();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err?.message || "Failed to accept quotation");
      }
    });
  };

  const handleConfirmReject = () => {
    if (!confirmRejectQuote) return;

    rejectMutation.mutate(
      { quotationId: confirmRejectQuote.id },
      {
        onSuccess: () => {
          toast.success("Quotation declined");
          setConfirmRejectQuote(null);
          refetch();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || err?.message || "Failed to decline quotation");
        }
      }
    );
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "FIXED":
        return { label: "Fixed Price", className: "reqquotes-pill-fixed" };
      case "ESTIMATED":
        return { label: "Estimated", className: "reqquotes-pill-estimated" };
      case "INSPECTION_REQUIRED":
        return { label: "Inspection Required", className: "reqquotes-pill-inspection" };
      default:
        return { label: type, className: "" };
    }
  };

  if (isLoading) {
    return (
      <div className="srdetails-card reqquotes-card-wrapper">
        <div className="srdetails-card-header">
          <div className="srdetails-card-header-left">
            <i className="fas fa-file-invoice-dollar srdetails-card-icon"></i>
            <h3 className="srdetails-card-title">Provider Quotations</h3>
          </div>
        </div>
        <div className="srdetails-shimmer" style={{ height: "140px", borderRadius: "10px" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="srdetails-card reqquotes-card-wrapper">
        <div className="srdetails-card-header">
          <div className="srdetails-card-header-left">
            <i className="fas fa-file-invoice-dollar srdetails-card-icon"></i>
            <h3 className="srdetails-card-title">Provider Quotations</h3>
          </div>
        </div>
        <div className="reqquotes-empty">
          <p className="reqquotes-empty-subtitle">Unable to load quotations for this request.</p>
          <button type="button" className="reqquotes-btn-chat" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="srdetails-card reqquotes-card-wrapper">
        <div className="srdetails-card-header">
          <div className="srdetails-card-header-left">
            <i className="fas fa-file-invoice-dollar srdetails-card-icon"></i>
            <h3 className="srdetails-card-title">Provider Quotations</h3>
          </div>
          <span className={`reqquotes-count-badge ${acceptedQuoteId ? "has-accepted" : ""}`}>
            {acceptedQuoteId
              ? "Provider Selected"
              : quotations.length === 1
              ? "1 Quote Received"
              : `${quotations.length} Quotes Received`}
          </span>
        </div>

        {quotations.length === 0 ? (
          <div className="reqquotes-empty">
            <div className="reqquotes-empty-icon">
              <i className="fas fa-paper-plane"></i>
            </div>
            <h4 className="reqquotes-empty-title">Awaiting Provider Quotations</h4>
            <p className="reqquotes-empty-subtitle">
              Verified service providers in your area have been notified and are reviewing your service request.
              Their estimates and quotations will appear here as soon as they submit.
            </p>
            <div className="reqquotes-empty-status-tag">
              <span className="reqquotes-pulse-dot" />
              <span>Matching active in your area</span>
            </div>
          </div>
        ) : (
          <div className="reqquotes-list">
            {quotations.map((quote) => {
              const typeConfig = getTypeLabel(quote.quotationType);
              const isAccepted = quote.status === "ACCEPTED";
              const isRejected = quote.status === "REJECTED";
              const isPending = quote.status === "PENDING";

              return (
                <div
                  key={quote.id}
                  className={`reqquotes-item ${
                    isAccepted ? "status-accepted" : isRejected ? "status-rejected" : ""
                  }`}
                >
                  <div className="reqquotes-item-header">
                    <div className="reqquotes-provider-info">
                      {quote.provider.profileImage ? (
                        <img
                          src={quote.provider.profileImage}
                          alt={quote.provider.businessName}
                          className="reqquotes-avatar"
                        />
                      ) : (
                        <div className="reqquotes-avatar-fallback">
                          {(quote.provider.businessName || quote.provider.name || "P").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="reqquotes-provider-details">
                        <div className="reqquotes-provider-name-row">
                          <span className="reqquotes-business-name">
                            {quote.provider.businessName || quote.provider.name}
                          </span>
                          <i className="fas fa-check-circle reqquotes-verified-badge" title="Verified Provider"></i>
                        </div>
                        <div className="reqquotes-provider-sub">
                          {quote.provider.experience && (
                            <span className="reqquotes-sub-pill">{quote.provider.experience}</span>
                          )}
                          {quote.provider.completedJobs > 0 && (
                            <span className="reqquotes-sub-pill">
                              <i className="fas fa-star" style={{ color: "#f59e0b", fontSize: "0.7rem", marginRight: "3px" }}></i>
                              {quote.provider.completedJobs} jobs
                            </span>
                          )}
                          <span className="reqquotes-sub-date">
                            Quoted{" "}
                            {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="reqquotes-price-container">
                      <span className="reqquotes-price-val">
                        ₹{quote.amount.toLocaleString("en-IN")}
                      </span>
                      <span className={`reqquotes-price-type-pill ${typeConfig.className}`}>
                        {typeConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="reqquotes-work-box">
                    <div className="reqquotes-work-icon">
                      <i className="fas fa-quote-left"></i>
                    </div>
                    <p className="reqquotes-work-text">{quote.workDescription}</p>
                  </div>

                  <div className="reqquotes-meta-grid">
                    {quote.availableDateTime && (
                      <div className="reqquotes-meta-pill">
                        <i className="far fa-calendar-alt"></i>
                        <span>Available: <strong>{quote.availableDateTime}</strong></span>
                      </div>
                    )}
                    {quote.estimatedDuration && (
                      <div className="reqquotes-meta-pill">
                        <i className="far fa-clock"></i>
                        <span>Duration: <strong>{quote.estimatedDuration}</strong></span>
                      </div>
                    )}
                    {quote.validUntilDate && (
                      <div className="reqquotes-meta-pill">
                        <i className="fas fa-hourglass-half"></i>
                        <span>
                          Valid until{" "}
                          <strong>
                            {new Date(quote.validUntilDate).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {(quote.includedItems.length > 0 || quote.excludedItems.length > 0) && (
                    <div className="reqquotes-deliverables-wrap">
                      {quote.includedItems.length > 0 && (
                        <div className="reqquotes-deliverables-row">
                          <span className="reqquotes-deliv-heading">Includes:</span>
                          <div className="reqquotes-chips-wrap">
                            {quote.includedItems.map((inc, i) => (
                              <span key={i} className="reqquotes-deliv-chip inc">
                                <i className="fas fa-check"></i> {inc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {quote.excludedItems.length > 0 && (
                        <div className="reqquotes-deliverables-row">
                          <span className="reqquotes-deliv-heading">Excludes:</span>
                          <div className="reqquotes-chips-wrap">
                            {quote.excludedItems.map((exc, i) => (
                              <span key={i} className="reqquotes-deliv-chip exc">
                                <i className="fas fa-times"></i> {exc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {quote.extraChargePolicy && (
                    <div className="reqquotes-policy-card">
                      <i className="fas fa-info-circle"></i>
                      <span>Policy: {quote.extraChargePolicy}</span>
                    </div>
                  )}

                  <div className="reqquotes-card-footer">
                    <button
                      type="button"
                      className="reqquotes-btn-chat"
                      onClick={() => handleChat(quote)}
                    >
                      <i className="far fa-comment-dots"></i>
                      <span>Chat with Provider</span>
                    </button>

                    <div className="reqquotes-actions-group">
                      {isAccepted && (
                        <div className="reqquotes-accepted-badge">
                          <i className="fas fa-check-circle"></i>
                          <span>Quotation Accepted</span>
                        </div>
                      )}

                      {isRejected && (
                        <span className="reqquotes-rejected-badge">
                          Declined
                        </span>
                      )}

                      {isPending && (
                        <>
                          <button
                            type="button"
                            className="reqquotes-btn-decline"
                            disabled={isRequestClosed || acceptMutation.isPending || rejectMutation.isPending}
                            onClick={() => setConfirmRejectQuote(quote)}
                          >
                            <i className="fas fa-times"></i>
                            <span>Decline</span>
                          </button>
                          <button
                            type="button"
                            className="reqquotes-btn-accept"
                            disabled={isRequestClosed || acceptMutation.isPending || rejectMutation.isPending}
                            onClick={() => setConfirmAcceptQuote(quote)}
                          >
                            <i className="fas fa-check"></i>
                            <span>Accept Quote</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {confirmAcceptQuote && (
        <div className="reqquotes-modal-overlay" onClick={() => setConfirmAcceptQuote(null)}>
          <div className="reqquotes-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="reqquotes-modal-header">
              <div className="reqquotes-modal-icon accept">
                <i className="fas fa-handshake"></i>
              </div>
              <h3 className="reqquotes-modal-title">Accept Quotation</h3>
            </div>
            <div className="reqquotes-modal-body">
              <p>
                Are you sure you want to accept the quotation from{" "}
                <strong>{confirmAcceptQuote.provider.businessName || confirmAcceptQuote.provider.name}</strong>?
              </p>
              <div className="reqquotes-modal-highlight-box">
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>Agreed Amount:</span>
                <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#16a34a" }}>
                  ₹{confirmAcceptQuote.amount.toLocaleString("en-IN")}
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                Accepting this quotation will assign this provider to your request and automatically decline any other quotes.
              </p>
            </div>
            <div className="reqquotes-modal-actions">
              <button
                type="button"
                className="reqquotes-btn-cancel"
                onClick={() => setConfirmAcceptQuote(null)}
                disabled={acceptMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="reqquotes-btn-accept"
                onClick={handleConfirmAccept}
                disabled={acceptMutation.isPending}
              >
                {acceptMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Accepting...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    <span>Confirm & Accept</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmRejectQuote && (
        <div className="reqquotes-modal-overlay" onClick={() => setConfirmRejectQuote(null)}>
          <div className="reqquotes-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="reqquotes-modal-header">
              <div className="reqquotes-modal-icon reject">
                <i className="fas fa-times-circle"></i>
              </div>
              <h3 className="reqquotes-modal-title">Decline Quotation</h3>
            </div>
            <div className="reqquotes-modal-body">
              <p>
                Are you sure you want to decline this quote of{" "}
                <strong>₹{confirmRejectQuote.amount.toLocaleString("en-IN")}</strong> from{" "}
                <strong>{confirmRejectQuote.provider.businessName || confirmRejectQuote.provider.name}</strong>?
              </p>
            </div>
            <div className="reqquotes-modal-actions">
              <button
                type="button"
                className="reqquotes-btn-cancel"
                onClick={() => setConfirmRejectQuote(null)}
                disabled={rejectMutation.isPending}
              >
                Keep Quote
              </button>
              <button
                type="button"
                className="reqquotes-btn-decline"
                onClick={handleConfirmReject}
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Declining...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-times"></i>
                    <span>Confirm Decline</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
