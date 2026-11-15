import React from "react";
import { useTheme } from "../../../shared/hooks/useTheme";
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
  description = "Your account access has been restricted due to policy violations, verification anomalies, or safety guidelines.",
  reason = "Policy violation or security review",
  referenceId,
  reactivationLink = "/account/request",
  loginLink = "/login",
  onRequestReactivation,
  onLogin,
}) => {
  const { toggleTheme } = useTheme();

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
    <div className="account-suspended-wrapper">
      <header className="account-suspended-header">
        <a href="/" className="account-suspended-brand-link" aria-label="Briosolve Home">
          <img src="/briosolve-text-logo.svg" alt="Briosolve" className="account-suspended-brand-text" />
        </a>

        <div className="account-suspended-header-actions">
          <button
            onClick={toggleTheme}
            className="account-suspended-theme-btn"
            aria-label="Toggle Theme"
            title="Toggle Theme"
            type="button"
          >
            <img src="/briosolve-logo.svg" alt="Briosolve" className="account-suspended-brand-logo-img" />
          </button>
        </div>
      </header>

      <main className="account-suspended-content">
        <div className="account-suspended-grid">
          <div className="account-suspended-left-col">
            <div className="account-suspended-badge">
              <span className="material-symbols-outlined text-[16px]">block</span>
              <span>Access Restricted</span>
            </div>

            <h1 className="account-suspended-title">{title}</h1>
            <p className="account-suspended-subtitle">{description}</p>

            <div className="account-suspended-card">
              <div className="account-suspended-card-header">
                <span className="material-symbols-outlined">assignment</span>
                <h3>Suspension Overview</h3>
              </div>

              <div className="account-suspended-card-body">
                <div className="account-suspended-info-row">
                  <span className="info-label">Current Status</span>
                  <span className="info-value status-danger">
                    <span className="status-dot"></span>
                    Suspended / Restricted
                  </span>
                </div>

                <div className="account-suspended-info-row">
                  <span className="info-label">Stated Reason</span>
                  <span className="info-value">{reason}</span>
                </div>

                {referenceId && (
                  <div className="account-suspended-info-row">
                    <span className="info-label">Reference ID</span>
                    <span className="info-value info-code">{referenceId}</span>
                  </div>
                )}

                <div className="account-suspended-info-row">
                  <span className="info-label">Restrictions</span>
                  <span className="info-value text-muted">
                    Bidding, dispatch, direct messaging, and payout processing disabled.
                  </span>
                </div>
              </div>

              <div className="account-suspended-callout">
                <span className="material-symbols-outlined callout-icon">info</span>
                <div className="callout-text">
                  <strong>Administrative Review:</strong> Reactivation requests are evaluated by our compliance team within 24 to 48 business hours. You will receive email notifications with status updates.
                </div>
              </div>
            </div>

            <div className="account-suspended-actions">
              <button
                type="button"
                className="account-suspended-primary-btn"
                onClick={handleReactivation}
              >
                <span>Request for Reactivation</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <button
                type="button"
                className="account-suspended-secondary-btn"
                onClick={handleLogin}
              >
                Back to Sign In
              </button>
            </div>
          </div>

          <div className="account-suspended-right-col">
            <div className="account-suspended-illustration-wrapper">
              <img
                src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794772354/blocked-logo.png"
                alt="Account Suspended"
                className="account-suspended-illustration"
              />
            </div>
          </div>
        </div>

        <div className="account-suspended-footer">
          <span>
            Need urgent assistance? Contact compliance support at{" "}
            <a href="mailto:support@briosolve.com" className="account-suspended-footer-link">
              support@briosolve.com
            </a>
          </span>
        </div>
      </main>
    </div>
  );
};

export default AccountSuspended;
