import { memo, useMemo } from 'react';
import type { VerificationDocument } from '../types/kyc.types';

interface KycStatusBannerProps {
  documents: VerificationDocument[];
}

export const KycStatusBanner = memo(({ documents }: KycStatusBannerProps) => {
  const { hasRejected, allApproved, hasPending } = useMemo(() => ({
    hasRejected: documents.some((doc) => doc.status === 'REJECTED'),
    allApproved: documents.length > 0 && documents.every((doc) => doc.status === 'APPROVED'),
    hasPending: documents.some((doc) => doc.status === 'PENDING'),
  }), [documents]);

  if (allApproved) {
    return (
      <div className="kyc-banner" style={{ borderLeft: '4px solid #10b981' }}>
        <div className="kyc-banner-left">
          <div className="kyc-banner-icon success">
            <i className="fas fa-shield-check"></i>
          </div>
          <div>
            <h2 className="kyc-banner-title">KYC Verified Provider</h2>
            <p className="kyc-banner-desc">
              Your profile is verified. You have full access to bidding, receiving direct service bookings, and your verified badge is visible to all clients.
            </p>
          </div>
        </div>
        <span className="kyc-status-pill approved">
          <i className="fas fa-check-circle"></i> Verified
        </span>
      </div>
    );
  }

  if (hasRejected) {
    return (
      <div className="kyc-banner" style={{ borderLeft: '4px solid #ef4444' }}>
        <div className="kyc-banner-left">
          <div className="kyc-banner-icon danger">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div>
            <h2 className="kyc-banner-title">Action Required: Document Rejected</h2>
            <p className="kyc-banner-desc">
              One or more of your verification documents could not be approved. Please view the rejection reason and upload clear replacements.
            </p>
          </div>
        </div>
        <span className="kyc-status-pill rejected">
          <i className="fas fa-times-circle"></i> Attention Needed
        </span>
      </div>
    );
  }

  if (hasPending) {
    return (
      <div className="kyc-banner" style={{ borderLeft: '4px solid #f59e0b' }}>
        <div className="kyc-banner-left">
          <div className="kyc-banner-icon warning">
            <i className="fas fa-clock"></i>
          </div>
          <div>
            <h2 className="kyc-banner-title">KYC Verification Under Review</h2>
            <p className="kyc-banner-desc">
              Our verification compliance team is reviewing your submitted documents. Review typically takes between 12 to 24 business hours.
            </p>
          </div>
        </div>
        <span className="kyc-status-pill pending">
          <i className="fas fa-hourglass-half"></i> Under Review
        </span>
      </div>
    );
  }

  return (
    <div className="kyc-banner" style={{ borderLeft: '4px solid var(--primary)' }}>
      <div className="kyc-banner-left">
        <div className="kyc-banner-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
          <i className="fas fa-id-card"></i>
        </div>
        <div>
          <h2 className="kyc-banner-title">Complete Your Provider KYC</h2>
          <p className="kyc-banner-desc">
            Submit your Government Identity and Additional Certificates to earn the Verified Provider badge and build trust with clients.
          </p>
        </div>
      </div>
      <span className="kyc-status-pill not_submitted">
        <i className="fas fa-circle-notch"></i> Incomplete
      </span>
    </div>
  );
});

KycStatusBanner.displayName = 'KycStatusBanner';
