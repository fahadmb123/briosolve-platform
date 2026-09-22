import './OtpVerification.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';
import React, { useState } from 'react';

export default function OtpVerification() {
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      // Simulate verification success
      navigate('/login');
    }
  };

  return (
    <div className="auth-page-wrapper">
        <button onClick={toggleTheme} id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
            <i className="fas fa-sun"></i>
        </button>

        <div className="auth-card-container">
            <div className="auth-card otp-card text-center">
                <Link to="/" className="logo justify-center mb-5">
                    <i className="fas fa-layer-group text-primary"></i>
                    <span>ReverseMarket</span>
                </Link>

                <div className="verify-icon-wrapper mb-4">
                    <div className="verify-icon-pulse"></div>
                    <div className="verify-icon-circle">
                        <i className="fas fa-shield-alt"></i>
                    </div>
                </div>

                <h1 className="h3 mb-2">Two-Step Verification</h1>
                <p className="text-secondary text-sm mb-6">
                    Enter the 6-digit verification code sent to your email or mobile device.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-6">
                        <input
                            type="text"
                            className="otp-single-input form-control text-center mx-auto"
                            maxLength={6}
                            placeholder="------"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg mb-5" disabled={otp.length !== 6}>
                        <span>Verify Account</span>
                        <i className="fas fa-check-circle ml-2"></i>
                    </button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-secondary mb-2">Didn't receive the code?</p>
                    <button type="button" className="btn btn-outline w-full mb-5">
                        <i className="fas fa-redo-alt mr-1"></i> Resend OTP
                    </button>
                </div>

                <div className="text-center text-sm border-top pt-5">
                    <Link to="/login" className="back-link">
                        <i className="fas fa-arrow-left mr-1"></i> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}
