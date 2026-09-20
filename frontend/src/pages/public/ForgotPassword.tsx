import React from 'react';

export default function ForgotPassword() {
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
                    <div className="lock-icon-circle mb-3">
                        <i className="fas fa-key"></i>
                    </div>
                    <h1 className="h3 mb-2">Password Recovery</h1>
                    <p className="text-secondary text-sm">
                        Enter your verified email address and we'll send a secure password reset link to your inbox.
                    </p>
                </div>

                <form action="../reset-password/reset-password.html" method="GET">
                    <div className="form-group mb-6">
                        <label className="form-label" htmlFor="recovery-email">Registered Email</label>
                        <div className="input-icon-wrapper">
                            <i className="fas fa-envelope"></i>
                            <input type="email" id="recovery-email" className="form-control" placeholder="name@domain.com" required />
                        </div>
                        <span className="field-hint text-xs text-muted mt-1 block">
                            We'll never share your email with third parties.
                        </span>
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg mb-5">
                        <span>Send Reset Instructions</span>
                        <i className="fas fa-paper-plane ml-1"></i>
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
    

    </>
  );
}
