import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../features/auth/stores/auth.store";
import "./VerificationRequiredCard.css";

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface VerificationItemConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  isVerified: boolean;
  actionText: string;
  onAction: () => void;
}

export interface VerificationRequiredCardProps {
  title?: string;
  description?: string;
  badgeText?: string;
  onBack?: () => void;
  showBack?: boolean;
  showDashboard?: boolean;
  className?: string;
}

export const VerificationRequiredCard: React.FC<VerificationRequiredCardProps> = ({
  title = "Complete Verification to Continue",
  description = "To maintain marketplace trust, prevent spam, and ensure users and providers can reach you, please complete the required verifications.",
  badgeText = "Verification Required",
  onBack,
  showBack = true,
  showDashboard = true,
  className = "",
}) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const verifications = useAuthStore((s) => s.verifications);

  const isCustomer = user?.role !== "PROVIDER";

  const verificationItems: VerificationItemConfig[] = [
    {
      id: "email",
      title: "Email Address",
      description: user?.email
        ? `Confirm ${user.email} to receive job offers, bids, and updates.`
        : "Confirm your email address to receive job offers and invoice receipts.",
      icon: "fas fa-envelope",
      isVerified: Boolean(verifications?.email),
      actionText: "Verify Email",
      onAction: () => {
        if (isCustomer) {
          navigate("/settings", { state: { activeView: "contact" } });
        } else {
          navigate("/provider/profile");
        }
      },
    },
    {
      id: "phone",
      title: "Phone Number",
      description: user?.phone
        ? `Verify ${user.phone} via SMS OTP for dispatch and provider coordination.`
        : "Add and verify your mobile number so service providers can coordinate arrival.",
      icon: "fas fa-phone-alt",
      isVerified: Boolean(verifications?.phone),
      actionText: "Verify Phone",
      onAction: () => {
        if (isCustomer) {
          navigate("/settings", { state: { activeView: "contact" } });
        } else {
          navigate("/provider/profile");
        }
      },
    },
    {
      id: "address",
      title: "Service Address",
      description: "Set a primary service address so nearby verified providers can calculate distance and travel time.",
      icon: "fas fa-map-marker-alt",
      isVerified: Boolean(verifications?.address),
      actionText: "Add Address",
      onAction: () => {
        if (isCustomer) {
          navigate("/settings", { state: { activeView: "addresses" } });
        } else {
          navigate("/provider/settings");
        }
      },
    },
    ...(verifications && "identity" in verifications
      ? [
          {
            id: "identity",
            title: "Identity & KYC Documents",
            description: "Upload government identity documents for verified provider status.",
            icon: "fas fa-id-card",
            isVerified: Boolean(verifications.identity),
            actionText: "Submit KYC",
            onAction: () => {
              navigate("/provider/kyc");
            },
          },
        ]
      : []),
  ];

  const completedCount = verificationItems.filter((item) => item.isVerified).length;
  const totalCount = verificationItems.length;
  const pendingCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`verification-required-wrapper ${className}`}>
      

      <div className="verification-required-card">
        <div className="verification-required-header">
          <div className="verification-required-badge-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="verification-required-header-text">
            <div className="verification-required-pill">
              <span className="verification-required-pill-dot"></span>
              <span>{badgeText}</span>
            </div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <div className="verification-required-progress-summary">
            <div className="verification-required-stat">
              <span className="verification-required-stat-num">
                {completedCount}/{totalCount}
              </span>
              <span className="verification-required-stat-label">Verified</span>
            </div>
            <div className="verification-required-progress-bar">
              <div
                className="verification-required-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="verification-required-stat-sub">
              {pendingCount} action{pendingCount === 1 ? "" : "s"} remaining
            </span>
          </div>
        </div>

        <div className="verification-required-list">
          {verificationItems.map((item) => (
            <div
              key={item.id}
              className={`verification-required-item ${
                item.isVerified ? "is-verified" : "is-pending"
              }`}
            >
              <div className="verification-required-item-icon">
                <i className={item.icon}></i>
              </div>
              <div className="verification-required-item-body">
                <div className="verification-required-item-top">
                  <span className="verification-required-item-title">
                    {item.title}
                  </span>
                  {item.isVerified ? (
                    <span className="verification-required-item-badge success">
                      <i className="fas fa-check-circle"></i> Verified
                    </span>
                  ) : (
                    <span className="verification-required-item-badge pending">
                      <i className="fas fa-clock"></i> Action Required
                    </span>
                  )}
                </div>
                <p className="verification-required-item-desc">
                  {item.description}
                </p>
              </div>
              <div className="verification-required-item-action">
                {item.isVerified ? (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm verification-required-btn"
                    disabled
                  >
                    <i className="fas fa-check"></i>
                    <span>Completed</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm verification-required-btn"
                    onClick={item.onAction}
                  >
                    <span>{item.actionText}</span>
                    <i className="fas fa-arrow-right text-xs"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="verification-required-footer">
          <div className="verification-required-footer-note">
            <i className="fas fa-lock"></i>
            <span>
              Your information is encrypted and securely stored. We never share
              your personal details with unverified parties.
            </span>
          </div>
          <div className="verification-required-footer-actions">
            {showBack && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleBack}
              >
                <i className="fas fa-arrow-left mr-1"></i> Go Back
              </button>
            )}
            {showDashboard && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() =>
                  navigate(isCustomer ? "/dashboard" : "/provider/dashboard")
                }
              >
                <i className="fas fa-th-large mr-1"></i> Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
