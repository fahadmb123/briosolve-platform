import React from 'react';

export default function ResetPassword() {
  return (
    <>
      
    <div className="auth-page-wrapper">
        {/*  Floating Theme Toggle  */}
        <button id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
            <i className="fas fa-sun"></i>
        </button>

        <div className="auth-card-container">
            <div className="auth-card card">
                <div className="text-center mb-6">
                    <a href="../home/home.html" className="logo justify-center mb-4">
                        <i className="fas fa-layer-group text-primary"></i>
                        <span>ReverseMarket</span>
                    </a>
                    <div className="shield-icon-circle mb-3">
                        <i className="fas fa-shield-alt"></i>
                    </div>
                    <h1 className="h3 mb-2">Create New Password</h1>
                    <p className="text-secondary text-sm">
                        Choose a strong, unique password to secure your marketplace account.
                    </p>
                </div>

                <form action="../login/login.html" method="GET">
                    <div className="form-group mb-4">
                        <label className="form-label" htmlFor="new-password">New Password</label>
                        <div className="input-icon-wrapper">
                            <i className="fas fa-lock"></i>
                            <input type="password" id="new-password" className="form-control" placeholder="At least 8 characters" required />
                        </div>
                        <div className="password-strength-bar mt-2">
                            <div className="strength-fill strength-medium"></div>
                        </div>
                        <div className="flex justify-between text-xs text-secondary mt-1">
                            <span>Password strength:</span>
                            <span className="text-warning font-medium">Good</span>
                        </div>
                    </div>

                    <div className="form-group mb-6">
                        <label className="form-label" htmlFor="confirm-new-password">Confirm New Password</label>
                        <div className="input-icon-wrapper">
                            <i className="fas fa-check-double"></i>
                            <input type="password" id="confirm-new-password" className="form-control" placeholder="Repeat your new password" required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg mb-5">
                        <span>Reset Password</span>
                        <i className="fas fa-arrow-right ml-1"></i>
                    </button>

                    <div className="text-center text-sm border-top pt-5">
                        <a href="../login/login.html" className="back-link">
                            <i className="fas fa-arrow-left mr-1"></i> Back to Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>

    {/*  Main JavaScript  */}
    <script src="../../assets/js/main.js"></script>

    </>
  );
}
