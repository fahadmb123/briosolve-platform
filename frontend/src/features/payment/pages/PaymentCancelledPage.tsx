import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import type { CustomerServiceRequestItem } from "../../service-requests/types/serviceRequest.types";
import "./PaymentCancelledPage.css";

interface PaymentCancelledLocationState {
  serviceRequestId?: string;
  quotationId?: string;
  amount?: number;
  providerName?: string;
  providerBusinessName?: string;
  serviceTitle?: string;
  requestItem?: CustomerServiceRequestItem | null;
}

export const PaymentCancelledPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as PaymentCancelledLocationState) || {};

  const amount = state.amount || 0;
  const serviceRequestId = state.serviceRequestId || "";
  const providerDisplay = state.providerBusinessName || state.providerName || "Service Provider";

  return (
    <div className="paycancel-page-container">
      <div className="paycancel-card">
        <div className="paycancel-icon-wrapper">
          <i className="fas fa-exclamation"></i>
        </div>

        <h1 className="paycancel-title">Payment Incomplete</h1>
        <p className="paycancel-subtitle">
          The payment transaction was cancelled before completion. No charges were made to your account.
        </p>

        <div className="paycancel-notice-box">
          <i className="fas fa-info-circle"></i>
          <div className="paycancel-notice-content">
            <h4>Your Quotation is Safe</h4>
            <p>
              Your service request is still open, and the quotation from <strong>{providerDisplay}</strong> remains active and pending. You can retry the payment whenever you are ready.
            </p>
          </div>
        </div>

        {amount > 0 && (
          <div className="paycancel-details-card">
            <div className="paycancel-detail-row">
              <span className="paycancel-detail-label">Service Provider</span>
              <span className="paycancel-detail-value">{providerDisplay}</span>
            </div>

            {state.serviceTitle && (
              <div className="paycancel-detail-row">
                <span className="paycancel-detail-label">Service</span>
                <span className="paycancel-detail-value">{state.serviceTitle}</span>
              </div>
            )}

            <div className="paycancel-detail-row">
              <span className="paycancel-detail-label">Quoted Total</span>
              <span className="paycancel-detail-value">₹{amount.toLocaleString("en-IN")}</span>
            </div>

            <div className="paycancel-detail-row">
              <span className="paycancel-detail-label">Transaction State</span>
              <span className="paycancel-detail-value" style={{ color: "#d97706" }}>
                Not Charged / Cancelled
              </span>
            </div>
          </div>
        )}

        <div className="paycancel-actions">
          {serviceRequestId ? (
            <button
              type="button"
              className="paycancel-btn-primary"
              onClick={() =>
                navigate(`/my-requests/${serviceRequestId}`, {
                  state: {
                    request: state.requestItem || null,
                    retryQuotationId: state.quotationId
                  }
                })
              }
            >
              <i className="fas fa-redo-alt"></i>
              <span>Try Payment Again</span>
            </button>
          ) : (
            <Link to="/my-requests" className="paycancel-btn-primary">
              <i className="fas fa-list-alt"></i>
              <span>Return to My Requests</span>
            </Link>
          )}

          <Link to="/dashboard" className="paycancel-btn-secondary">
            <i className="fas fa-home"></i>
            <span>Customer Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelledPage;
