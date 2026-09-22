import './ForgotPassword.css';


import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';

export default function ForgotPassword() {
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/reset-password');
  };

  return (
    <>
      
    <div className="auth-page-wrapper">
        
        <button onClick={toggleTheme} id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
            <i className="fas fa-sun"></i>
        </button>

        <div className="auth-card-container">
            <div className="auth-card card">
                <div className="text-center mb-6">
                    <Link to="/" className="logo justify-center mb-4">
                        <i className="fas fa-layer-group text-primary"></i>
                        <span>ReverseMarket</span>
                    </Link>
                    <div className="lock-icon-circle mb-3">
                        <i className="fas fa-key"></i>
                    </div>
                    <h1 className="h3 mb-2">Password Recovery</h1>
                    <p className="text-secondary text-sm">
                        Enter your verified email address and we'll send a secure password reset link to your inbox.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
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
                        <Link to="/login" className="back-link">
                            <i className="fas fa-arrow-left mr-1"></i> Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>

    
    

    </>
  );
}
