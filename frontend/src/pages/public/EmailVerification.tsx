import React from 'react';

export default function EmailVerification() {
  return (
    <>
      
    <div className="auth-page-wrapper">
        {/*  Floating Theme Toggle  */}
        <button id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
            <i className="fas fa-sun"></i>
        </button>

        <div className="auth-card-container">
            <div className="auth-card card text-center">
                <a href="../home/home.html" className="logo justify-center mb-5">
                    <i className="fas fa-layer-group text-primary"></i>
                    <span>ReverseMarket</span>
                </a>

                <div className="verify-icon-wrapper mb-4">
                    <div className="verify-icon-pulse"></div>
                    <div className="verify-icon-circle">
                        <i className="fas fa-envelope-open-text"></i>
                    </div>
                </div>

                <h1 className="h3 mb-2">Check Your Inbox</h1>
                <p className="text-secondary text-sm mb-4">
                    We've sent a 6-digit confirmation link to:
                </p>
                <div className="user-email-chip mb-6">
                    <i className="fas fa-user-check text-primary mr-1"></i>
                    <strong className="text-text">aarav.sharma@example.com</strong>
                </div>

                <div className="instruction-box card bg-surface-elevated p-4 mb-6 text-left">
                    <div className="flex gap-3">
                        <i className="fas fa-lightbulb text-warning mt-1"></i>
                        <p className="text-xs text-secondary mb-0">
                            Please click the link inside the email to verify your customer account. If you don't see it within 2 minutes, check your spam or promotions folder.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <a href="#" onClick={() => { /* handleVerification(event) */ }} className="btn btn-primary w-full btn-lg">
                        <span>I've Verified My Email</span>
                        <i className="fas fa-arrow-right ml-1"></i>
                    </a>

                    <button type="button" className="btn btn-secondary w-full" id="resend-btn">
                        <i className="fas fa-redo-alt mr-1"></i> Resend Verification Email
                    </button>

                    <a href="../otp-verification/otp-verification.html" className="btn btn-outline w-full text-xs">
                        <i className="fas fa-mobile-alt mr-1"></i> Verify via Mobile OTP Instead
                    </a>
                </div>

                <div className="text-center text-sm border-top pt-5 mt-6">
                    <a href="../login/login.html" className="back-link">
                        <i className="fas fa-arrow-left mr-1"></i> Back to Login
                    </a>
                </div>
            </div>
        </div>
    </div>

    {/*  Main JavaScript  */}
    <script src="../../assets/js/main.js"></script>
    <script>
        function handleVerification(e) {
            e.preventDefault();
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('context') === 'switch_role') {
                // Deactivate provider capability conceptually without deleting data
                localStorage.setItem('providerActive', 'false');
            }
            window.location.href = '../dashboard/dashboard.html';
        }
    </script>

    </>
  );
}
