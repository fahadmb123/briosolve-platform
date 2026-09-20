import './Login.css';


import { Link } from 'react-router-dom';
export default function Login() {
  return (
    <>
      
    <div className="auth-page-wrapper">
        
        <button id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
            <i className="fas fa-sun"></i>
        </button>

        <div className="auth-card-container">
            <div className="auth-card card">
                
                <div className="text-center mb-6">
                    <Link to="/" className="logo justify-center mb-4">
                        <i className="fas fa-layer-group text-primary"></i>
                        <span>ReverseMarket</span>
                    </Link>
                    <h1 className="h3 mb-2">Welcome Back</h1>
                    <p className="text-secondary text-sm">Sign in to manage your requests and quotations</p>
                </div>

                
                <div className="role-info-banner mb-6">
                    <i className="fas fa-info-circle text-primary"></i>
                    <span className="text-xs text-secondary">
                        <strong>One Login:</strong> Customers and service providers use the same unified login. Your portal opens automatically based on your account role.
                    </span>
                </div>

                
                <form action="../dashboard/dashboard.html" method="GET">
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <div className="input-icon-wrapper">
                            <i className="fas fa-envelope"></i>
                            <input type="email" id="email" className="form-control" placeholder="name@domain.com" required value="customer@example.com" />
                        </div>
                    </div>

                    <div id="otp-section" style={{ display: 'none' }}>
                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="login-otp">Verification Code (Check Email)</label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-key"></i>
                                <input type="text" id="login-otp" className="form-control" placeholder="e.g. 123456" maxLength={6} />
                            </div>
                        </div>

                        <div className="form-group flex items-center justify-between mb-6">
                            <label className="checkbox-container">
                                <input type="checkbox" id="remember" checked />
                                <span className="checkmark"></span>
                                <span className="text-xs text-secondary">Remember me on this device</span>
                            </label>
                            <Link to="#" className="text-xs text-primary font-medium" onClick={() => {  }}>Resend Code</Link>
                        </div>
                    </div>

                    <button type="button" id="send-otp-btn" className="btn btn-primary w-full btn-lg mb-3">
                        <span>Send Verification Code</span>
                        <i className="fas fa-paper-plane ml-1"></i>
                    </button>

                    <button type="submit" id="login-btn" className="btn btn-primary w-full btn-lg mb-6" style={{ display: 'none' }}>
                        <span>Verify & Sign In</span>
                        <i className="fas fa-arrow-right ml-1"></i>
                    </button>

                    
                    <div className="auth-footer text-center border-top pt-5">
                        <p className="text-sm text-secondary mb-3">
                            Don't have a customer account? 
                            <Link to="/register" className="text-primary font-semibold">Sign Up</Link>
                        </p>
                        <div className="provider-cta-box">
                            <span className="text-xs text-secondary">Looking to offer services?</span>
                            <Link to="/register" className="text-xs font-semibold text-primary">
                                Become a Provider <i className="fas fa-external-link-alt ml-1"></i>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    
    
    

    </>
  );
}
