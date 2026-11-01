import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import './BankAccountSettings.css';

export type BankVerificationStatus =
  | 'VERIFIED'
  | 'VERIFICATION_PENDING'
  | 'VERIFICATION_FAILED'
  | 'NOT_CONNECTED'
  | 'ACCOUNT_RESTRICTED';

interface BankAccountData {
  bankName: string;
  accountHolderName: string;
  maskedAccountNumber: string;
  ifscCode: string;
  branchName: string;
  accountType: 'Savings' | 'Current';
  lastVerifiedDate: string;
  verificationMethod: string;
  referenceId: string;
}

const INITIAL_BANK_DATA: BankAccountData = {
  bankName: 'HDFC Bank Ltd.',
  accountHolderName: 'Fahad M Basheer',
  maskedAccountNumber: '•••• •••• 4582',
  ifscCode: 'HDFC0001234',
  branchName: 'Indiranagar Branch, Bengaluru',
  accountType: 'Current',
  lastVerifiedDate: 'Oct 24, 2026, 11:30 AM IST',
  verificationMethod: 'Automated NPCI Penny Drop (IMPS)',
  referenceId: 'PNY_IMPS_894320198',
};

export const BankAccountSettings: React.FC = () => {
  const [status, setStatus] = useState<BankVerificationStatus>('VERIFIED');
  const [bankData, setBankData] = useState<BankAccountData>(INITIAL_BANK_DATA);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isMasked, setIsMasked] = useState(true);

  const [formHolder, setFormHolder] = useState(bankData.accountHolderName);
  const [formBank, setFormBank] = useState(bankData.bankName);
  const [formAccountNum, setFormAccountNum] = useState('');
  const [formConfirmNum, setFormConfirmNum] = useState('');
  const [formIfsc, setFormIfsc] = useState(bankData.ifscCode);
  const [formType, setFormType] = useState<'Savings' | 'Current'>(bankData.accountType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenConnect = () => {
    setFormHolder(bankData.accountHolderName);
    setFormBank('HDFC Bank Ltd.');
    setFormAccountNum('');
    setFormConfirmNum('');
    setFormIfsc('HDFC0001234');
    setFormType('Savings');
    setIsUpdateModalOpen(true);
  };

  const handleOpenUpdate = () => {
    setFormHolder(bankData.accountHolderName);
    setFormBank(bankData.bankName);
    setFormAccountNum('');
    setFormConfirmNum('');
    setFormIfsc(bankData.ifscCode);
    setFormType(bankData.accountType);
    setIsUpdateModalOpen(true);
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAccountNum || !formConfirmNum) {
      toast.error('Please enter and confirm account number');
      return;
    }
    if (formAccountNum !== formConfirmNum) {
      toast.error('Account numbers do not match');
      return;
    }
    if (!formIfsc || formIfsc.length < 11) {
      toast.error('Please enter a valid 11-character IFSC code');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const last4 = formAccountNum.slice(-4) || '9912';
      setBankData({
        ...bankData,
        bankName: formBank || 'Connected Bank Ltd.',
        accountHolderName: formHolder,
        maskedAccountNumber: `•••• •••• ${last4}`,
        ifscCode: formIfsc.toUpperCase(),
        accountType: formType,
        lastVerifiedDate: 'Just now (Pending validation)',
      });
      setStatus('VERIFICATION_PENDING');
      setIsSubmitting(false);
      setIsUpdateModalOpen(false);
      toast.success('Bank details submitted. Penny-drop verification initiated!');
    }, 1200);
  };

  return (
    <div className="bank-account-container">
      <div className="bank-header-banner">
        <div>
          <h2 className="h4 mb-1 font-bold text-text">Bank Account &amp; Payouts</h2>
          <p className="text-xs text-secondary mb-0">
            Configure your verified settlement account for automated customer payments and service booking payouts.
          </p>
        </div>

        <div className="bank-status-pill-group">
          <span className="text-2xs font-bold text-secondary uppercase px-1">Preview State:</span>
          {(
            [
              ['VERIFIED', 'Verified'],
              ['VERIFICATION_PENDING', 'Pending'],
              ['VERIFICATION_FAILED', 'Failed'],
              ['ACCOUNT_RESTRICTED', 'Restricted'],
              ['NOT_CONNECTED', 'Not Connected'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`bank-status-switch-btn ${status === key ? 'active' : ''}`}
              onClick={() => setStatus(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bank-card">
        <div className="bank-card-header">
          <div className="bank-identity-group">
            <div className="bank-icon-badge">
              <i className="fas fa-university"></i>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="h6 mb-0 font-bold text-text">
                  {status === 'NOT_CONNECTED' ? 'No Bank Account Connected' : bankData.bankName}
                </h3>
                {status === 'VERIFIED' && (
                  <span className="badge badge-success text-2xs uppercase px-2 py-0.5 font-bold">
                    <i className="fas fa-check-circle mr-1"></i> Verified
                  </span>
                )}
                {status === 'VERIFICATION_PENDING' && (
                  <span className="badge badge-warning text-2xs uppercase px-2 py-0.5 font-bold">
                    <i className="fas fa-clock mr-1"></i> Verification Pending
                  </span>
                )}
                {status === 'VERIFICATION_FAILED' && (
                  <span className="badge badge-danger text-2xs uppercase px-2 py-0.5 font-bold">
                    <i className="fas fa-times-circle mr-1"></i> Verification Failed
                  </span>
                )}
                {status === 'ACCOUNT_RESTRICTED' && (
                  <span className="badge badge-danger text-2xs uppercase px-2 py-0.5 font-bold">
                    <i className="fas fa-shield-alt mr-1"></i> Account Restricted
                  </span>
                )}
                {status === 'NOT_CONNECTED' && (
                  <span className="badge badge-neutral text-2xs uppercase px-2 py-0.5 font-bold">
                    Not Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-secondary mb-0">
                {status === 'NOT_CONNECTED'
                  ? 'Connect a registered domestic bank account to enable job payouts.'
                  : `${bankData.accountType} Account • Primary Direct Settlement Method`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {status !== 'NOT_CONNECTED' ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(true)}
                  className="btn btn-outline btn-sm text-xs flex items-center gap-1.5"
                >
                  <i className="fas fa-file-invoice text-primary"></i>
                  <span>View Verification Details</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenUpdate}
                  className="btn btn-primary btn-sm text-xs flex items-center gap-1.5"
                >
                  <i className="fas fa-edit"></i>
                  <span>Update Bank Account</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleOpenConnect}
                className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-sm"
              >
                <i className="fas fa-plus-circle"></i>
                <span>Connect Bank Account</span>
              </button>
            )}
          </div>
        </div>

        {status === 'NOT_CONNECTED' ? (
          <div className="bank-empty-state">
            <div className="bank-empty-icon">
              <i className="fas fa-piggy-bank"></i>
            </div>
            <h4 className="text-sm font-bold text-text mb-1">Add Payout Bank Details</h4>
            <p className="text-xs text-secondary max-w-md mb-4">
              Payouts for completed bookings are transferred directly via automated IMPS settlements. Connect your bank account to initiate instant verification.
            </p>
            <button
              type="button"
              onClick={handleOpenConnect}
              className="btn btn-primary px-6 text-xs flex items-center gap-1.5"
            >
              <i className="fas fa-link"></i>
              <span>Connect Bank Account Now</span>
            </button>
          </div>
        ) : (
          <>
            <div className="bank-details-grid">
              <div className="bank-detail-item">
                <span className="bank-detail-label">Account Holder</span>
                <span className="bank-detail-value truncate">{bankData.accountHolderName}</span>
              </div>

              <div className="bank-detail-item">
                <span className="bank-detail-label">Account Number</span>
                <span className="bank-detail-value mono">
                  {isMasked ? bankData.maskedAccountNumber : '50100492844582'}
                  <button
                    type="button"
                    onClick={() => setIsMasked(!isMasked)}
                    className="btn-icon text-xs text-secondary hover:text-text ml-1"
                    title={isMasked ? 'Reveal Account Number' : 'Hide Account Number'}
                  >
                    <i className={`fas ${isMasked ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                  </button>
                </span>
              </div>

              <div className="bank-detail-item">
                <span className="bank-detail-label">IFSC Code</span>
                <span className="bank-detail-value mono">{bankData.ifscCode}</span>
              </div>

              <div className="bank-detail-item">
                <span className="bank-detail-label">Bank &amp; Branch</span>
                <span className="bank-detail-value truncate">{bankData.branchName}</span>
              </div>

              <div className="bank-detail-item">
                <span className="bank-detail-label">Account Verification</span>
                <span className="bank-detail-value text-xs font-semibold">
                  {status === 'VERIFIED' && <span className="text-success"><i className="fas fa-shield-check mr-1"></i> Penny Drop Matched</span>}
                  {status === 'VERIFICATION_PENDING' && <span className="text-warning"><i className="fas fa-spinner fa-spin mr-1"></i> Validating Micro-Deposit</span>}
                  {status === 'VERIFICATION_FAILED' && <span className="text-danger"><i className="fas fa-exclamation-triangle mr-1"></i> Name Mismatch</span>}
                  {status === 'ACCOUNT_RESTRICTED' && <span className="text-danger"><i className="fas fa-ban mr-1"></i> Flagged for Review</span>}
                </span>
              </div>

              <div className="bank-detail-item">
                <span className="bank-detail-label">Last Verified Date</span>
                <span className="bank-detail-value text-xs">{bankData.lastVerifiedDate}</span>
              </div>
            </div>

            <div className="bank-actions-toolbar">
              <span className="text-2xs text-secondary mr-auto">
                <i className="fas fa-info-circle mr-1"></i>
                Account changes require 15-minute re-verification before next scheduled settlement.
              </span>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(true)}
                className="btn btn-outline btn-sm text-xs"
              >
                Audit Log
              </button>
              <button
                type="button"
                onClick={handleOpenUpdate}
                className="btn btn-outline btn-sm text-xs"
              >
                Change Bank
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {status === 'VERIFIED' && (
          <div className="status-callout verified">
            <i className="fas fa-check-circle status-callout-icon"></i>
            <div className="status-callout-body">
              <div className="status-callout-title">Bank Account Successfully Verified</div>
              <p className="status-callout-desc">
                Your bank account has been verified via automated penny-drop validation. Booking proceeds and milestone funds will be disbursed automatically to this account according to your payout schedule.
              </p>
            </div>
          </div>
        )}

        {status === 'VERIFICATION_PENDING' && (
          <div className="status-callout pending">
            <i className="fas fa-clock status-callout-icon"></i>
            <div className="status-callout-body">
              <div className="status-callout-title">Verification In Progress</div>
              <p className="status-callout-desc">
                Your banking credentials have been submitted to the automated payment switch. An instant ₹1.00 test deposit is underway to confirm account ownership. This typically concludes within 5 to 15 minutes.
              </p>
            </div>
          </div>
        )}

        {status === 'VERIFICATION_FAILED' && (
          <div className="status-callout failed">
            <i className="fas fa-exclamation-triangle status-callout-icon"></i>
            <div className="status-callout-body">
              <div className="status-callout-title">Bank Verification Failed</div>
              <p className="status-callout-desc">
                The account could not be validated. The legal beneficiary name returned by your banking institution does not match your registered KYC profile. Please ensure you enter an account registered in your legal name.
              </p>
            </div>
          </div>
        )}

        {status === 'ACCOUNT_RESTRICTED' && (
          <div className="status-callout restricted">
            <i className="fas fa-ban status-callout-icon"></i>
            <div className="status-callout-body">
              <div className="status-callout-title">Account Restricted by Compliance</div>
              <p className="status-callout-desc">
                Settlements to this bank account have been paused due to risk policy checks or bank returned flags. Please update your bank details or contact provider compliance support to restore automated settlements.
              </p>
            </div>
          </div>
        )}

        {status === 'NOT_CONNECTED' && (
          <div className="status-callout not-connected">
            <i className="fas fa-info-circle status-callout-icon"></i>
            <div className="status-callout-body">
              <div className="status-callout-title">No Active Payout Method</div>
              <p className="status-callout-desc">
                Connecting a bank account is required before booking funds can be released. Completed service requests will accrue in your platform wallet until a verified account is attached.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bank-card">
        <div className="flex justify-between items-center mb-5 pb-4 border-bottom border-border">
          <div>
            <h3 className="h6 mb-0.5 font-bold text-text">Payout &amp; Settlement Information</h3>
            <p className="text-xs text-secondary mb-0">
              Overview of your payout eligibility, settlement schedule, and clearance status.
            </p>
          </div>
          <span className={`badge ${status === 'VERIFIED' ? 'badge-success' : 'badge-warning'} text-xs font-semibold px-2.5 py-1`}>
            {status === 'VERIFIED' ? 'Settlements Enabled' : 'Action Required'}
          </span>
        </div>

        <div className="payout-metrics-grid">
          <div className="payout-metric-box">
            <div className="payout-metric-header">
              <span>Payout Eligibility</span>
              <i className="fas fa-bolt text-primary"></i>
            </div>
            <div className="payout-metric-value">
              {status === 'VERIFIED' ? (
                <span className="text-success flex items-center gap-1.5 text-sm font-bold">
                  <i className="fas fa-check-circle"></i> Fully Eligible
                </span>
              ) : status === 'VERIFICATION_PENDING' ? (
                <span className="text-warning flex items-center gap-1.5 text-sm font-bold">
                  <i className="fas fa-clock"></i> Verification In Queue
                </span>
              ) : (
                <span className="text-danger flex items-center gap-1.5 text-sm font-bold">
                  <i className="fas fa-times-circle"></i> On Hold
                </span>
              )}
            </div>
            <p className="payout-metric-sub">
              {status === 'VERIFIED'
                ? 'Automated direct bank IMPS enabled'
                : 'Complete bank verification to release payouts'}
            </p>
          </div>

          <div className="payout-metric-box">
            <div className="payout-metric-header">
              <span>Payout Account Status</span>
              <i className="fas fa-link text-primary"></i>
            </div>
            <div className="payout-metric-value text-sm font-bold">
              {status === 'VERIFIED' ? 'Active & Ready' : status === 'NOT_CONNECTED' ? 'Unlinked' : 'Pending Review'}
            </div>
            <p className="payout-metric-sub">
              {status === 'VERIFIED' ? 'Direct deposit route operational' : 'No payout channel activated'}
            </p>
          </div>

          <div className="payout-metric-box">
            <div className="payout-metric-header">
              <span>Next Expected Settlement</span>
              <i className="fas fa-calendar-alt text-primary"></i>
            </div>
            <div className="payout-metric-value text-sm font-bold">
              {status === 'VERIFIED' ? 'Friday, Nov 06, 2026' : 'Awaiting Verification'}
            </div>
            <p className="payout-metric-sub">
              {status === 'VERIFIED' ? 'Automated batch execution by 6:00 PM IST' : 'Funds accumulate safely in escrow'}
            </p>
          </div>

          <div className="payout-metric-box">
            <div className="payout-metric-header">
              <span>Settlement Frequency</span>
              <i className="fas fa-sync text-primary"></i>
            </div>
            <div className="payout-metric-value text-sm font-bold">
              Weekly (Every Friday)
            </div>
            <p className="payout-metric-sub">
              T+2 working day clearance cycle
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-border bg-surface-hover flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <i className="fas fa-clipboard-check"></i>
            </div>
            <div>
              <div className="text-xs font-bold text-text">Pending Verification Requirements</div>
              <div className="text-2xs text-secondary">
                {status === 'VERIFIED'
                  ? 'All banking compliance, KYC identity, and micro-deposits are satisfied.'
                  : status === 'NOT_CONNECTED'
                  ? 'Add your bank account number and IFSC code to complete settlement onboarding.'
                  : 'Penny drop test confirmation pending from payment clearing network.'}
              </div>
            </div>
          </div>
          <span className={`badge ${status === 'VERIFIED' ? 'badge-success' : 'badge-neutral'} text-2xs uppercase px-2 py-0.5`}>
            {status === 'VERIFIED' ? 'Zero Pending Tasks' : 'Requirements Incomplete'}
          </span>
        </div>
      </div>

      <div className="security-card">
        <div className="security-card-header">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <i className="fas fa-shield-alt text-base"></i>
          </div>
          <h4 className="security-card-title">Security &amp; Data Protection Standards</h4>
        </div>

        <div className="security-features-list">
          <div className="security-feature-item">
            <i className="fas fa-lock security-feature-icon"></i>
            <div>
              <strong className="text-text block mb-0.5 font-bold">Encrypted Gateway Transit</strong>
              Bank details are handled securely through PCI-DSS Level 1 certified banking payment gateways via 256-bit TLS encryption.
            </div>
          </div>

          <div className="security-feature-item">
            <i className="fas fa-database security-feature-icon"></i>
            <div>
              <strong className="text-text block mb-0.5 font-bold">Zero Storage of Sensitive Credentials</strong>
              Sensitive banking information (such as NetBanking PINs, full credentials, or CVVs) is never stored directly by our application.
            </div>
          </div>

          <div className="security-feature-item">
            <i className="fas fa-user-shield security-feature-icon"></i>
            <div>
              <strong className="text-text block mb-0.5 font-bold">Masked Account Display</strong>
              Only masked account numbers and public routing IFSC codes are displayed for verification audit integrity.
            </div>
          </div>
        </div>
      </div>

      {isUpdateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsUpdateModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <i className="fas fa-university text-primary"></i>
                <h3 className="h6 mb-0 font-bold text-text">
                  {status === 'NOT_CONNECTED' ? 'Connect Payout Bank Account' : 'Update Bank Account'}
                </h3>
              </div>
              <button
                type="button"
                className="btn-icon text-secondary hover:text-text"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitModal}>
              <div className="modal-body">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary flex items-start gap-2">
                  <i className="fas fa-info-circle mt-0.5 shrink-0"></i>
                  <span>The beneficiary name on the bank account must match your registered KYC name (<strong>{bankData.accountHolderName}</strong>).</span>
                </div>

                <div className="modern-input-group mb-0">
                  <label>Account Holder Legal Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formHolder}
                    onChange={(e) => setFormHolder(e.target.value)}
                    required
                  />
                </div>

                <div className="modern-input-group mb-0">
                  <label>Bank Name</label>
                  <select
                    className="form-control"
                    value={formBank}
                    onChange={(e) => setFormBank(e.target.value)}
                  >
                    <option value="HDFC Bank Ltd.">HDFC Bank Ltd.</option>
                    <option value="ICICI Bank Ltd.">ICICI Bank Ltd.</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="Axis Bank Ltd.">Axis Bank Ltd.</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="modern-input-group mb-0">
                    <label>Account Number</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter account number"
                      value={formAccountNum}
                      onChange={(e) => setFormAccountNum(e.target.value)}
                      required
                    />
                  </div>

                  <div className="modern-input-group mb-0">
                    <label>Confirm Account Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Re-enter account number"
                      value={formConfirmNum}
                      onChange={(e) => setFormConfirmNum(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="modern-input-group mb-0">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      className="form-control uppercase"
                      placeholder="e.g. HDFC0001234"
                      maxLength={11}
                      value={formIfsc}
                      onChange={(e) => setFormIfsc(e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  <div className="modern-input-group mb-0">
                    <label>Account Type</label>
                    <select
                      className="form-control"
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as 'Savings' | 'Current')}
                    >
                      <option value="Savings">Savings Account</option>
                      <option value="Current">Current Account</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm px-5 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Initiating Penny Drop...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shield-check"></i>
                      <span>Verify &amp; Link Account</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAuditModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAuditModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2">
                <i className="fas fa-clipboard-check text-primary"></i>
                <h3 className="h6 mb-0 font-bold text-text">Verification Audit Trail</h3>
              </div>
              <button
                type="button"
                className="btn-icon text-secondary hover:text-text"
                onClick={() => setIsAuditModalOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="p-3 rounded-lg bg-surface-hover border border-border flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-text">NPCI Penny Drop Test</div>
                  <div className="text-2xs text-secondary">Automated IMPS ₹1.00 credit transaction</div>
                </div>
                <span className="badge badge-success text-2xs uppercase px-2 py-0.5 font-bold">
                  Passed &amp; Matched
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="audit-row">
                  <span className="audit-row-label">Reference ID</span>
                  <span className="audit-row-value">{bankData.referenceId}</span>
                </div>
                <div className="audit-row">
                  <span className="audit-row-label">Verification Timestamp</span>
                  <span className="audit-row-value">{bankData.lastVerifiedDate}</span>
                </div>
                <div className="audit-row">
                  <span className="audit-row-label">Validation Method</span>
                  <span className="audit-row-value">{bankData.verificationMethod}</span>
                </div>
                <div className="audit-row">
                  <span className="audit-row-label">Beneficiary Name Match</span>
                  <span className="audit-row-value text-success">100% Exact Match</span>
                </div>
                <div className="audit-row">
                  <span className="audit-row-label">Bank Clearing Code</span>
                  <span className="audit-row-value">ACTC - Account Active</span>
                </div>
                <div className="audit-row">
                  <span className="audit-row-label">Clearing Gateway</span>
                  <span className="audit-row-value">Razorpay Route Direct</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setIsAuditModalOpen(false)}
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

