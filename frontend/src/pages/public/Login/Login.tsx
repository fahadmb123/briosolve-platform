// @ts-nocheck
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
        setIsSubmitting(false);
        if (email.includes('admin')) {
            navigate('/admin/dashboard');
        } else if (email.includes('provider')) {
            navigate('/provider/dashboard');
        } else if (email.includes('investigator')) {
            navigate('/investigator/dashboard');
        } else {
            navigate('/dashboard');
        }
    }, 600);
  };

  return (
    <div className="auth-page-wrapper">
        <button id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
            <i className="fas fa-sun"></i>
        </button>

        <div className="auth-card-container">
            <div className="auth-card">
                
                <div className="auth-form-header">
                    <Link to="/" className="auth-brand-logo">
                        <i className="fas fa-layer-group"></i>
                        <span>ReverseMarket</span>
                    </Link>
                    <h2>Sign In</h2>
                    <p>Enter your email and password to securely access your account.</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="premium-input-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="premium-input-wrapper">
                            <i className="fas fa-envelope"></i>
                            <input 
                                type="email" 
                                id="email" 
                                className="premium-input" 
                                placeholder="name@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <div className="premium-input-group">
                        <label htmlFor="password">Password</label>
                        <div className="premium-input-wrapper">
                            <i className="fas fa-lock"></i>
                            <input 
                                type="password" 
                                id="password" 
                                className="premium-input" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <div className="auth-actions">
                        <label className="custom-checkbox">
                            <input type="checkbox" defaultChecked />
                            <div className="checkmark-box"><i className="fas fa-check"></i></div>
                            Remember me
                        </label>
                        <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                    </div>

                    <button type="submit" className="btn-premium" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <><i className="fas fa-circle-notch fa-spin"></i> Authenticating...</>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </div>

            </div>
        </div>
    </div>
  );
}
