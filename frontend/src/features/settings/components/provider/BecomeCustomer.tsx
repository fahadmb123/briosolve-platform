import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore, OtpModal } from '../../../auth';
import { useBecomeCustomer, useSendBecomeCustomerOtp } from '../../hooks/provider/useBecomeCustomer';
import type { ApiError } from '../../../../shared/api/ApiError';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';

export function BecomeCustomer() {
    const [showOtpModal, setShowOtpModal] = useState(false);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    const sendOtpMut = useSendBecomeCustomerOtp();
    const becomeCustomerMut = useBecomeCustomer();

    const onSubmit = () => {
        sendOtpMut.mutate(undefined, {
            onSuccess: () => setShowOtpModal(true),
            onError: (err: ApiError) => toast.error(err.message || 'Failed to send OTP')
        });
    };

    const handleOtpSuccess = () => {
        setShowOtpModal(false);
        becomeCustomerMut.mutate(undefined, {
            onSuccess: async () => {
                toast.success('Successfully switched to customer account!');
                clearAuth();
                window.location.href = '/settings';
            },
            onError: (err: ApiError) => toast.error(err.message || 'Failed to switch account')
        });
    };

    const isLoading = sendOtpMut.isPending || becomeCustomerMut.isPending;

    return (
        <div className="card p-6 fade-in">
            {isLoading && <SpinnerOverlay isLoading={true} />}

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: 'rgba(99,102,241,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <i className="fas fa-user text-primary" style={{ fontSize: '1.2rem' }} />
                    </div>
                    <div>
                        <h2 className="h5 mb-0">Become a Customer</h2>
                        <p className="text-xs text-secondary mb-0">
                            Switch your account to request services, post job requirements, and hire verified service professionals.
                        </p>
                    </div>
                </div>

                {/* Important Warning Notice */}
                <div className="flex items-start gap-3 mt-4 p-4 rounded-lg" style={{
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.25)'
                }}>
                    <i className="fas fa-exclamation-triangle text-warning mt-1" style={{ fontSize: '1.1rem' }} />
                    <div>
                        <p className="font-semibold text-sm mb-1 text-warning">Account Transition Notice</p>
                        <p className="text-xs text-secondary mb-0 leading-relaxed">
                            Switching to a customer account will permanently remove your active provider profile, trade services, working availability schedule, and uploaded verification documents. You will need to verify your email via a one-time passcode (OTP) to confirm this action.
                        </p>
                    </div>
                </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg border bg-surface-card" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.08))' }}>
                    <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                        <i className="fas fa-clipboard-list" />
                        <span>Post Requirements</span>
                    </div>
                    <p className="text-xs text-secondary mb-0">
                        Create custom service requests and specify your budget, schedule, and location preferences.
                    </p>
                </div>

                <div className="p-4 rounded-lg border bg-surface-card" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.08))' }}>
                    <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                        <i className="fas fa-comments-dollar" />
                        <span>Compare Quotes</span>
                    </div>
                    <p className="text-xs text-secondary mb-0">
                        Receive bids from certified providers, compare ratings, and choose the perfect match for the job.
                    </p>
                </div>

                <div className="p-4 rounded-lg border bg-surface-card" style={{ borderColor: 'var(--border-color, rgba(255,255,255,0.08))' }}>
                    <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                        <i className="fas fa-star" />
                        <span>Rate & Review</span>
                    </div>
                    <p className="text-xs text-secondary mb-0">
                        Leave verified ratings and reviews after service completion to help maintain quality marketplace standards.
                    </p>
                </div>
            </div>

            {/* Action Bar */}
            <div className="pt-5 border-top flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-secondary">
                    <i className="fas fa-shield-alt text-primary" />
                    <span>Requires 2-step OTP verification sent to your registered email</span>
                </div>

                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="btn btn-primary flex items-center justify-center gap-2"
                    style={{
                        minWidth: '200px',
                        padding: '0.75rem 1.75rem',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? (
                        <>
                            <i className="fas fa-spinner fa-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <i className="fas fa-user-check" />
                            <span>Become a Customer</span>
                        </>
                    )}
                </button>
            </div>

            <OtpModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onSuccess={handleOtpSuccess}
            />
        </div>
    );
}
