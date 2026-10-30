import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '../../../../shared/hooks/useTheme';
import { useAccountReactivation, useSendReactivationOtp } from '../../hooks/useAccountReactivation';
import {
    accountReactivationSchema,
    type AccountReactivationInputType,
} from '../../schemas/validation';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { OtpModal } from '../../components/OtpModal';
import { toast } from 'react-hot-toast';
import './AccountRequest.css';
import type { ApiError } from '../../../../shared/api/ApiError';

export default function AccountRequest() {
    const { theme, toggleTheme } = useTheme();
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [pendingData, setPendingData] = useState<AccountReactivationInputType | null>(null);

    const reactivationMut = useAccountReactivation();
    const sendOtpMut = useSendReactivationOtp();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<AccountReactivationInputType>({
        resolver: zodResolver(accountReactivationSchema),
        mode: 'onChange',
    });

    const submittedEmail = watch('email');

    const onSubmit = (data: AccountReactivationInputType) => {
        setErrorMessage(null);
        setPendingData(data);
        sendOtpMut.mutate(
            { email: data.email },
            {
                onSuccess: () => {
                    setShowOtpModal(true);
                },
                onError: (err: ApiError) => {
                    setErrorMessage(err?.message || 'Failed to send verification code');
                },
            }
        );
    };

    const handleOtpSuccess = () => {
        setShowOtpModal(false);
        if (!pendingData) return;
        reactivationMut.mutate(pendingData, {
            onSuccess: (res) => {
                toast.success(res.message || 'Submitted!');
                setSubmitted(true);
            },
            onError: (err: ApiError) => {
                setErrorMessage(err?.message || 'Failed to submit reactivation request');
            },
        });
    };

    return (
        <div className="account-request-page-wrapper">
            {(reactivationMut.isPending || sendOtpMut.isPending) && <SpinnerOverlay isLoading={true} />}

            <header className="account-request-topbar">
                <Link to="/" className="brand-logo-container justify-center mb-4" aria-label="Briosolve Home">
                            <img src="/briosolve-logo.svg" alt="Briosolve" className="brand-emblem-logo" />
                            <img src="/briosolve-text-logo.svg" alt="Briosolve" className="brand-text-logo" />
                        </Link>

                <div className="account-request-topbar-actions">
                    <button
                        onClick={toggleTheme}
                        id="theme-toggle"
                        className="btn-icon"
                        aria-label="Toggle Theme"
                        title="Toggle Theme"
                    >
                        <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'}></i>
                    </button>
                    <Link to="/login" className="btn btn-secondary btn-sm">
                        <span>Sign In</span>
                    </Link>
                </div>
            </header>

            <main className="account-request-main">
                <nav className="account-request-breadcrumb" aria-label="Breadcrumb">
                    <Link to="/">Home</Link>
                    <i className="fas fa-chevron-right"></i>
                    <span>Support</span>
                    <i className="fas fa-chevron-right"></i>
                    <span>Account Reactivation</span>
                </nav>

                <div className="account-request-page-header">
                    <h1 className="account-request-page-title">
                        {!submitted ? 'Account Reactivation Request' : 'Reactivation Request Submitted'}
                    </h1>
                    <p className="account-request-page-desc">
                        {!submitted
                            ? 'If your account has been suspended or restricted, you can submit a formal reactivation request to our administration team for review.'
                            : 'Thank you. Your account reactivation request has been received and queued for administrative review.'}
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {errorMessage && (
                            <div className="account-request-error-banner">
                                <i className="fas fa-exclamation-circle"></i>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <div className="account-request-section">
                            <h2 className="account-request-section-title">1. Account Email Address</h2>
                            <p className="account-request-section-hint">
                                Enter the registered email address associated with your suspended account.
                            </p>
                            <div className="account-request-input-wrapper">
                                <input
                                    type="email"
                                    id="account-email"
                                    {...register('email')}
                                    className={`account-request-text-input ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder="name@example.com"
                                />
                                {errors.email && (
                                    <span className="account-request-error-text">
                                        {errors.email.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="account-request-section">
                            <h2 className="account-request-section-title">2. Reason for Reactivation</h2>
                            <p className="account-request-section-hint">
                                Please describe the circumstances and explain why your account should be reinstated (must be greater than 10 characters).
                            </p>
                            <div className="account-request-input-wrapper">
                                <textarea
                                    id="account-reason"
                                    rows={6}
                                    {...register('reason')}
                                    className={`account-request-textarea-input ${errors.reason ? 'is-invalid' : ''}`}
                                    placeholder="Provide detailed explanation and any relevant context..."
                                />
                                {errors.reason && (
                                    <span className="account-request-error-text">
                                        {errors.reason.message}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="account-request-section">
                            <div className="account-request-actions-bar">
                                <button
                                    type="submit"
                                    disabled={reactivationMut.isPending || sendOtpMut.isPending}
                                    className="account-request-submit-btn"
                                >
                                    <span>
                                        {sendOtpMut.isPending
                                            ? 'Sending Code...'
                                            : reactivationMut.isPending
                                            ? 'Submitting...'
                                            : 'Submit Request'}
                                    </span>
                                    {!(reactivationMut.isPending || sendOtpMut.isPending) && (
                                        <i className="fas fa-arrow-right"></i>
                                    )}
                                </button>
                                <Link to="/login" className="account-request-cancel-btn">
                                    Cancel and Return to Sign In
                                </Link>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="account-request-success-box">
                        <div className="account-request-success-badge">
                            <i className="fas fa-check-circle"></i>
                            <span>Request Successfully Queued</span>
                        </div>

                        <div className="account-request-success-summary">
                            <div className="account-request-summary-row">
                                <span className="account-request-summary-label">Submitted Account</span>
                                <span className="account-request-summary-val">{submittedEmail}</span>
                            </div>
                            <div className="account-request-summary-row">
                                <span className="account-request-summary-label">Status</span>
                                <span className="account-request-summary-val" style={{ color: 'var(--warning, #f59e0b)' }}>
                                    Pending Review
                                </span>
                            </div>
                        </div>

                        <div className="account-request-actions-bar">
                            <Link to="/" className="account-request-submit-btn">
                                Return to Homepage
                            </Link>
                            <Link to="/login" className="account-request-cancel-btn">
                                Return to Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            <OtpModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onSuccess={handleOtpSuccess}
                email={submittedEmail}
            />
        </div>
    );
}
