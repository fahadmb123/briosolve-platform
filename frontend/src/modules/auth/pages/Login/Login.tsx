import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../shared/hooks/useTheme';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInputType } from '../../schemas/validation';
import './Login.css';
import { useLogin } from '../../hooks/mutations/use-otp-varify';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { useAuthStore } from '../../../../store/auth/auth.store';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';


export default function Login() {
    const navigate = useNavigate()
    const { toggleTheme } = useTheme()
    const login = useLogin()
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
        login.mutate(data, {
            onSuccess: (response) => {
                useAuthStore.getState().setUser(response.data)
                console.log(response.data.role)
                if (response.data.role === "CUSTOMER"){
                    navigate("/",{replace:true})
                    console.log("From Login")
                } else {
                    console.log("From Other Routes")
                    navigate(`/${response.data.role.toLocaleLowerCase()}`,{replace:true})
                }
                toast.success(response.message)
            }
        });
    }

    return (
        
        <div className="auth-page-wrapper">
            <button onClick={toggleTheme} id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
                <i className="fas fa-sun"></i>
            </button>
            {login.isPending ? (<SpinnerOverlay isLoading={true}/>):null }
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

                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-envelope"></i>
                                <input 
                                    type="email" 
                                    id="email" 
                                    className={`form-control ${errors.email ? 'border-danger' : ''}`}
                                    placeholder="name@example.com" 
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && <div className="text-danger text-xs mt-2">{errors.email.message}</div>}
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="password">Password</label>
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
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle Password Visibility"
                                    style={{ background: 'none', border: 'none', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {errors.password && <div className="text-danger text-xs mt-2">{errors.password.message}</div>}
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            
                            <Link to="/forgot-password" className="text-primary font-medium text-xs">Forgot Password?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary w-full btn-lg mb-4">Sign In</button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </div>

                </div>
            </div>
            
            {/* Floating Home Box */}
            <div className="navbar-action-box always-visible" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
                <Link to="/" className="btn btn-outline btn-sm" style={{ borderRadius: '2rem' }}>
                    <i className="fas fa-home mr-1"></i> Home
                </Link>
            </div>
        </div>
    );
}
