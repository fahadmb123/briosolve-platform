import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import type { CustomerServiceRequestItem } from "../../service-requests/types/serviceRequest.types";
import "./PaymentSuccessPage.css";

interface PaymentSuccessLocationState {
  paymentId?: string;
  orderId?: string;
  amount?: number;
  quotationId?: string;
  serviceRequestId?: string;
  providerName?: string;
  providerBusinessName?: string;
  serviceTitle?: string;
  requestItem?: CustomerServiceRequestItem | null;
  bookingId?: string;
  bookingNumber?: string;
}

export const PaymentSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as PaymentSuccessLocationState) || {};

  const amount = state.amount || 0;
  const serviceRequestId = state.serviceRequestId || "";
  const providerDisplay = state.providerBusinessName || state.providerName || "Service Provider";

  return (
    <div className="paysuccess-page-container">
      <div className="paysuccess-card">
        <div className="paysuccess-icon-wrapper">
          <i className="fas fa-check"></i>
        </div>

        <h1 className="paysuccess-title">Payment Confirmed!</h1>
        <p className="paysuccess-subtitle">
          Your quotation acceptance and payment have been verified. <strong>{providerDisplay}</strong> has been assigned to your service request.
        </p>

        <div className="paysuccess-escrow-badge">
          <i className="fas fa-shield-alt"></i>
          <div className="paysuccess-escrow-content">
            <h4>Escrow Protection Active</h4>
            <p>
              Your payment of ₹{amount.toLocaleString("en-IN")} is held securely by BrioSolve Escrow. Funds are only transferred to the service provider after you confirm that the service has been completed to your satisfaction.
            </p>
          </div>
        </div>

        <div className="paysuccess-warranty-pill">
          <i className="fas fa-certificate"></i>
          <span>15-Day Service Quality Warranty Included</span>
        </div>

        <div className="paysuccess-details-card">
          <div className="paysuccess-detail-row">
            <span className="paysuccess-detail-label">Amount Paid</span>
            <span className="paysuccess-detail-value highlight">₹{amount.toLocaleString("en-IN")}</span>
          </div>

          <div className="paysuccess-detail-row">
            <span className="paysuccess-detail-label">Service Provider</span>
            <span className="paysuccess-detail-value">{providerDisplay}</span>
          </div>

          {state.serviceTitle && (
            <div className="paysuccess-detail-row">
              <span className="paysuccess-detail-label">Service</span>
              <span className="paysuccess-detail-value">{state.serviceTitle}</span>
            </div>
          )}

          {state.bookingNumber && (
            <div className="paysuccess-detail-row">
              <span className="paysuccess-detail-label">Booking Reference</span>
              <span className="paysuccess-detail-value mono" style={{ color: "#ea580c", fontWeight: 700 }}>
                {state.bookingNumber}
              </span>
            </div>
          )}

          <div className="paysuccess-detail-row">
            <span className="paysuccess-detail-label">Payment Security</span>
            <span className="paysuccess-detail-value">
              <i className="fas fa-shield-alt" style={{ marginRight: "4px", color: "#16a34a" }}></i> 100% Escrow Protected
            </span>
          </div>

          <div className="paysuccess-detail-row">
            <span className="paysuccess-detail-label">Status</span>
            <span className="paysuccess-detail-value" style={{ color: "#16a34a" }}>
              <i className="fas fa-lock" style={{ marginRight: "4px" }}></i> Paid & Secured in Escrow
            </span>
          </div>
        </div>

        <div className="paysuccess-actions">
          {serviceRequestId ? (
            <button
              type="button"
              className="paysuccess-btn-primary"
              onClick={() =>
                navigate(`/my-requests/${serviceRequestId}`, {
                  state: {
                    request: state.requestItem
                      ? { ...state.requestItem, status: "ACCEPTED" }
                      : null
                  }
                })
              }
            >
              <i className="fas fa-arrow-left"></i>
              <span>View Service Request</span>
            </button>
          ) : (
            <Link to="/my-requests" className="paysuccess-btn-primary">
              <i className="fas fa-list-alt"></i>
              <span>View My Requests</span>
            </Link>
          )}

          <Link to="/dashboard" className="paysuccess-btn-secondary">
            <i className="fas fa-home"></i>
            <span>Customer Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
