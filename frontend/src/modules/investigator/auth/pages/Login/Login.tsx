import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../../../shared/hooks/useTheme';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInputType } from '../../../../auth/schemas/validation';

export default function Login() {
  const { toggleTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const {
      register,
      handleSubmit,
      formState: { errors }
  } = useForm<LoginInputType>({
      resolver: zodResolver(loginSchema),
      mode: "onChange"
  })

  const handleLogin = (data: LoginInputType) => {
      console.log("Investigator Login data:", data)
      // TODO: call investigator login mutation
  }

  return (
    <>
<div className="auth-page-wrapper">
        
        <button onClick={toggleTheme} id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
            <i className="fas fa-sun"></i>
        </button>

        <div className="auth-card-container">
            <div className="auth-card card">
                
                <div className="text-center mb-6">
                    <Link to="#" className="logo justify-center mb-4">
                        <i className="fas fa-layer-group text-danger"></i>
                        <span>ReverseMarket</span>
                    </Link>
                    <h1 className="h3 mb-2">Investigator Portal</h1>
                    <p className="text-secondary text-sm">Internal access for technical staff</p>
                </div>

                
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

                
                <form id="investigator-login-form" onSubmit={handleSubmit(handleLogin)}>
                    <div className="form-group mb-4">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <div className="input-icon-wrapper">
                            <i className="fas fa-envelope"></i>
                            <input 
                                type="email" 
                                id="email" 
                                className={`form-control ${errors.email ? 'border-danger' : ''}`}
                                placeholder="investigator@reversemarket.com" 
                                {...register("email")}
                            />
                        </div>
                        {errors.email && <div className="text-danger text-xs mt-2">{errors.email.message}</div>}
                    </div>

                    <div className="form-group mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="form-label mb-0" htmlFor="password">Password</label>
                            <Link to="#" className="text-xs text-danger font-medium"
                                onClick={() => {}}>Forgot
                                Password?</Link>
                        </div>
                        <div className="input-icon-wrapper">
                            <i className="fas fa-lock"></i>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                id="password" 
                                className={`form-control ${errors.password ? 'border-danger' : ''}`} 
                                placeholder="••••••••" 
                                {...register("password")}
                            />
                            <button 
                                type="button" 
                                className="toggle-password" 
                                id="toggle-password-btn"
                                aria-label="Toggle Password Visibility"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                        {errors.password && <div className="text-danger text-xs mt-2">{errors.password.message}</div>}
                    </div>

                    <div className="form-group flex items-center justify-between mb-6">
                        <label className="checkbox-container">
                            <input type="checkbox" id="remember" defaultChecked />
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

    
    </>
  );
}
