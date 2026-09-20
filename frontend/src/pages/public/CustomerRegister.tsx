import React from 'react';

export default function CustomerRegister() {
  return (
    <>
      
    <div className="auth-page-wrapper">
        {/*  Floating Theme Toggle  */}
        <button id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
            <i className="fas fa-sun"></i>
        </button>

        <div className="auth-card-container register-container">
            {/*  Provider Callout Banner  */}
            <div className="provider-callout-card mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="provider-badge-icon"><i className="fas fa-briefcase"></i></div>
                    <div>
                        <div className="font-semibold text-xs text-text">Are you a service professional?</div>
                        <div className="text-xs text-secondary">Join as a verified contractor and receive customer jobs</div>
                    </div>
                </div>
                <a href="../../provider/register/register.html" className="btn btn-outline text-xs py-1">
                    Become a Provider <i className="fas fa-arrow-right ml-1"></i>
                </a>
            </div>

            <div className="auth-card card">
                {/*  Header  */}
                <div className="text-center mb-6">
                    <a href="../home/home.html" className="logo justify-center mb-3">
                        <i className="fas fa-layer-group text-primary"></i>
                        <span>ReverseMarket</span>
                    </a>
                    <h1 className="h3 mb-1">Create Customer Account</h1>
                    <p className="text-secondary text-sm">Post requirements and receive competitive quotations for free</p>
                </div>

                {/*  Registration Form  */}
                <form action="../email-verification/email-verification.html" method="GET">
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
                                I agree to the <a href="#" className="text-primary">Terms of Service</a>, <a href="#" className="text-primary">Privacy Policy</a>, and customer code of conduct.
                            </span>
                        </label>
                    </div>

                    <div className="flex items-center justify-end text-xs text-secondary mb-4">
                        <a href="../otp-verification/otp-verification.html" className="text-primary font-medium hidden">
                            <i className="fas fa-mobile-alt mr-1"></i> Instant Mobile OTP
                        </a>
                    </div>

                    <button type="submit" className="btn btn-primary w-full btn-lg mb-4">
                        <span>Complete Registration</span>
                        <i className="fas fa-arrow-right"></i>
                    </button>

                    <div className="text-center text-sm text-secondary pt-4 border-top">
                        Already have an account? 
                        <a href="../login/login.html" className="text-primary font-semibold">Sign In</a>
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
