import React from "react";
import "./AccountSuspended.css";

export interface AccountSuspendedProps {
  title?: string;
  description?: string;
  reason?: string;
  referenceId?: string;
  reactivationLink?: string;
  loginLink?: string;
  onRequestReactivation?: () => void;
  onLogin?: () => void;
}

export const AccountSuspended: React.FC<AccountSuspendedProps> = ({
  title = "Account Suspension Notice",
  description = "Your account access has been suspended due to policy violations, verification anomalies, or safety restrictions.",
  reason = "Policy violation or security review",
  referenceId,
  reactivationLink = "/account/request",
  loginLink = "/login",
  onRequestReactivation,
  onLogin,
}) => {
  const handleReactivation = () => {
    if (onRequestReactivation) {
      onRequestReactivation();
    } else {
      window.location.href = reactivationLink;
    }
  };

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      window.location.href = loginLink;
    }
  };

  return (
    <div className="account-suspended-page-wrapper">
      <header className="account-suspended-topbar">
        <a href="/" className="brand-logo-container" aria-label="Briosolve Home">
          <img src="/briosolve-logo.svg" alt="Briosolve" className="brand-emblem-logo" />
          <img src="/briosolve-text-logo.svg" alt="Briosolve" className="brand-text-logo" />
        </a>

        <div className="account-suspended-topbar-actions">
          <button type="button" onClick={handleLogin} className="account-suspended-signin-btn">
            <span>Sign In</span>
          </button>
        </div>
      </header>

      <main className="account-suspended-main">
        <nav className="account-suspended-breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <i className="fas fa-chevron-right"></i>
          <span>Support</span>
          <i className="fas fa-chevron-right"></i>
          <span>Account Suspension</span>
        </nav>

        <div className="account-suspended-page-header">
          <div className="account-suspended-badge-row">
            <span className="account-suspended-status-badge">
              <i className="fas fa-ban"></i>
              <span>Account Suspended</span>
            </span>
          </div>
          <h1 className="account-suspended-page-title">{title}</h1>
          <p className="account-suspended-page-desc">{description}</p>
        </div>

        <div className="account-suspended-section">
          <h2 className="account-suspended-section-title">1. Suspension Details</h2>
          <p className="account-suspended-section-hint">
            Review the status and justification recorded on your account.
          </p>
          <div className="account-suspended-details-panel">
            <div className="account-suspended-detail-row">
              <span className="account-suspended-detail-label">Current Status</span>
              <span className="account-suspended-detail-value danger">Suspended / Restricted</span>
            </div>
            <div className="account-suspended-detail-row">
              <span className="account-suspended-detail-label">Stated Reason</span>
              <span className="account-suspended-detail-value">{reason}</span>
            </div>
            {referenceId && (
              <div className="account-suspended-detail-row">
                <span className="account-suspended-detail-label">Reference ID</span>
                <span className="account-suspended-detail-value code">{referenceId}</span>
              </div>
            )}
            <div className="account-suspended-detail-row">
              <span className="account-suspended-detail-label">Restrictions Applied</span>
              <span className="account-suspended-detail-value">
                Bidding, booking dispatch, direct messaging, and payout processing disabled.
              </span>
            </div>
          </div>
        </div>

        <div className="account-suspended-section">
          <h2 className="account-suspended-section-title">2. Appeal & Reactivation Options</h2>
          <p className="account-suspended-section-hint">
            If you believe this action was made in error or have addressed the underlying concern, you may submit a formal request for reactivation with supporting details.
          </p>

          <div className="account-suspended-notice-box">
            <i className="fas fa-info-circle"></i>
            <div>
              <strong>Administrative Review Process:</strong> Reactivation requests are handled by our compliance team within 24 to 48 business hours. You will receive email notifications regarding any status updates.
            </div>
          </div>
        </div>

        <div className="account-suspended-section">
          <div className="account-suspended-actions-bar">
            <button
              type="button"
              className="account-suspended-submit-btn"
              onClick={handleReactivation}
            >
              <span>Request for Reactivation</span>
              <i className="fas fa-arrow-right"></i>
            </button>
            <button
              type="button"
              className="account-suspended-cancel-btn"
              onClick={handleLogin}
            >
              Back to Sign In
            </button>
          </div>
        </div>

        <div className="account-suspended-footer-help">
          <span>
            Need urgent assistance? Contact compliance support at{" "}
            <a href="mailto:support@briosolve.com" className="account-suspended-footer-link">
              support@briosolve.com
            </a>
            .
          </span>
        </div>
      </main>
    </div>
  );
};

export default AccountSuspended;
