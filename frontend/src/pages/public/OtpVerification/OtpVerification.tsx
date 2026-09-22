import './OtpVerification.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';
import React, { useState, useRef, useEffect } from 'react';

export default function OtpVerification() {
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    // Allow single digit or the last typed digit
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input if value is entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Move focus to the previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasteData.some(char => isNaN(Number(char)))) return;
    
    const newOtp = [...otp];
    pasteData.forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    
    // Focus the last filled input
    const focusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
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
                    <div className="otp-input-group mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                className="otp-input form-control"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onPaste={handlePaste}
                                ref={(el) => (inputRefs.current[index] = el)}
                                required
                            />
                        ))}
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg mb-5" disabled={otp.join('').length < 6}>
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
