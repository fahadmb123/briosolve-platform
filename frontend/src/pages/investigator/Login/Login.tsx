// @ts-nocheck
import React from 'react';

export default function Login() {
  return (
    <>
<div className="auth-page-wrapper">
        {/*  Floating Theme Toggle  */}
        <button id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
            <i className="fas fa-sun"></i>
        </button>

        <div className="auth-card-container">
            <div className="auth-card card">
                {/*  Header  */}
                <div className="text-center mb-6">
                    <a href="#" className="logo justify-center mb-4">
                        <i className="fas fa-layer-group text-danger"></i>
                        <span>ReverseMarket</span>
                    </a>
                    <h1 className="h3 mb-2">Investigator Portal</h1>
                    <p className="text-secondary text-sm">Internal access for technical staff</p>
                </div>

                {/*  Unified Role Info Banner  */}
                <div className="role-info-banner mb-6">
                    <i className="fas fa-shield-alt text-danger"></i>
                    <span className="text-xs text-secondary">
                        <strong>Restricted Access:</strong> This portal is exclusively for authorized active
                        investigators.
                    </span>
                </div>

                <div id="login-error" className="error-message">
                    <i className="fas fa-exclamation-circle mr-1"></i> <span id="login-error-text">Invalid
                        credentials.</span>
                </div>

                {/*  Form  */}
                <form id="investigator-login-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <div className="input-icon-wrapper">
                            <i className="fas fa-envelope"></i>
                            <input type="email" id="email" className="form-control"
                                placeholder="investigator@reversemarket.com" required />
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="form-label mb-0" htmlFor="password">Password</label>
                            <a href="#" className="text-xs text-danger font-medium"
                                onClick={() => {}}>Forgot
                                Password?</a>
                        </div>
                        <div className="input-icon-wrapper">
                            <i className="fas fa-lock"></i>
                            <input type="password" id="password" className="form-control" placeholder="••••••••" required />
                            <button type="button" className="toggle-password" id="toggle-password-btn"
                                aria-label="Toggle Password Visibility">
                                <i className="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>

                    <div className="form-group flex items-center justify-between mb-6">
                        <label className="checkbox-container">
                            <input type="checkbox" id="remember" checked />
                            <span className="checkmark"
                                style={{"borderColor":"var(--border)","backgroundColor":"var(--bg)"}}></span>
                            <span className="text-xs text-secondary">Remember me on this device</span>
                        </label>
                    </div>

                    <button type="submit" id="login-btn" className="btn btn-danger w-full btn-lg mb-4">
                        <span>Secure Login</span>
                        <i className="fas fa-arrow-right ml-1"></i>
                    </button>
                </form>
            </div>
        </div>
    </div>

    {/*  Main JavaScript  */}
    </>
  );
}
