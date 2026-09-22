import './CustomerRegister.css';


import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../shared/hooks/useTheme';

export default function CustomerRegister() {
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/otp-verification');
  };

  return (
    <>
      
    <div className="auth-page-wrapper">
        
        <button id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme" onClick={toggleTheme}>
            <i className="fas fa-sun"></i>
        </button>

        <div className="auth-card-container register-container">
            
            <div className="provider-callout-card mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="provider-badge-icon"><i className="fas fa-briefcase"></i></div>
                    <div>
                        <div className="font-semibold text-xs text-text">Are you a service professional?</div>
                        <div className="text-xs text-secondary">Join as a verified contractor and receive customer jobs</div>
                    </div>
                </div>
                <Link to="/register" className="btn btn-outline text-xs py-1">
                    Become a Provider <i className="fas fa-arrow-right ml-1"></i>
                </Link>
            </div>

            <div className="auth-card card">
                
                <div className="text-center mb-6">
                    <Link to="/" className="logo justify-center mb-3">
                        <i className="fas fa-layer-group text-primary"></i>
                        <span>ReverseMarket</span>
                    </Link>
                    <h1 className="h3 mb-1">Create Customer Account</h1>
                    <p className="text-secondary text-sm">Post requirements and receive competitive quotations for free</p>
                </div>

                
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="full-name">Full Name</label>
                        <div className="input-icon-wrapper">
                            <i className="fas fa-user"></i>
                            <input type="text" id="full-name" className="form-control" placeholder="Aarav Sharma" required />
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <div className="input-icon-wrapper">
                            <i className="fas fa-envelope"></i>
                            <input type="email" id="email" className="form-control" placeholder="aarav@example.com" required />
                        </div>
                    </div>

                    <div className="form-row-2">
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-lock"></i>
                                <input type="password" id="password" className="form-control" placeholder="At least 8 chars" required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-check-double"></i>
                                <input type="password" id="confirm-password" className="form-control" placeholder="Repeat password" required />
                            </div>
                        </div>
                    </div>

                    <div className="form-group mb-6">
                        <label className="checkbox-container">
                            <input type="checkbox" id="terms" required />
                            <span className="checkmark"></span>
                            <span className="text-xs text-secondary">
                                I agree to the <Link to="#" className="text-primary">Terms of Service</Link>, <Link to="#" className="text-primary">Privacy Policy</Link>, and customer code of conduct.
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end text-xs text-secondary mb-4">
                        <Link to="//verification" className="text-primary font-medium hidden">
                            <i className="fas fa-mobile-alt mr-1"></i> Instant Mobile OTP
                        </Link>
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg mb-4">
                        <span>Complete Registration</span>
                        <i className="fas fa-arrow-right"></i>
                    </button>

                    <div className="text-center text-sm text-secondary pt-4 border-top">
                        Already have an account? 
                        <Link to="/login" className="text-primary font-semibold">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    </div>

    
    

    </>
  );
}
