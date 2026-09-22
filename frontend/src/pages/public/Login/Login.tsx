import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../shared/hooks/useTheme';
import './Login.css';

export default function Login() {
    
    //const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const {toggleTheme} = useTheme()
 

    return (
        <div className="auth-page-wrapper">
            <button onClick={toggleTheme} id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
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

                    <form >
                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-envelope"></i>
                                <input 
                                    type="email" 
                                    id="email" 
                                    className="form-control" 
                                    placeholder="name@example.com" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="password">Password</label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-lock"></i>
                                <input 
                                    type="password" 
                                    id="password" 
                                    className="form-control" 
                                    placeholder="••••••••" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            
                            <Link to="/forgot-password" className="text-primary font-medium text-xs">Forgot Password?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary w-full btn-lg mb-4" >Sign In</button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
