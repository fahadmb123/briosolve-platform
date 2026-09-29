import './CustomerRegister.css';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../../../shared/hooks/useTheme';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInputType } from '../../schemas/validation';
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { useRegisterCustomer } from '../../hooks/mutations/use-register-customer';
import { SpinnerOverlay } from '../../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { useResetFlowStore } from '../../../../../store/auth/reset-flow.store';




export default function CustomerRegister() {
    const { toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const setOtpFlowStarted = useResetFlowStore((state) => state.setOtpFlowStarted);
    const registerMutation = useRegisterCustomer()
    const {register,handleSubmit,formState:{errors}} = useForm<RegisterInputType>({
        resolver : zodResolver(registerSchema),mode : "onChange"
    })

    const handleRegister = async (data:RegisterInputType) => {
        try {
            const response = await registerMutation.mutateAsync({
                name:data.name,
                email:data.email,
                password:data.password 
            })
            setOtpFlowStarted(true)
            navigate("/otp-verification",{replace:true})
            toast.success(response.message)
        } catch (err) {
            if (isAxiosError(err) && err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };

    return ( 
        <>
        {registerMutation.isPending ? (<SpinnerOverlay isLoading={true}/>):null }
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
                    <Link to="/provider/register" replace className="btn btn-outline text-xs py-1">
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

                    
                    <form onSubmit={handleSubmit(handleRegister)}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="full-name">Full Name</label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-user"></i>
                                <input  {...register("name")} type="text" id="full-name" className={`form-control ${errors.name ? 'border-danger' : ''}`} placeholder="Aarav Sharma"  />
                            </div>
                            {errors.name && <span className="text-danger text-xs mt-1 block">{errors.name.message}</span>}
                        </div>

                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-envelope"></i>
                                <input  {...register("email")} type="email" id="email" className={`form-control ${errors.email ? 'border-danger' : ''}`} placeholder="aarav@example.com"  />
                            </div>
                            {errors.email && <span className="text-danger text-xs mt-1 block">{errors.email.message}</span>}
                        </div>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label className="form-label" htmlFor="password">Password</label>
                                <div className="input-icon-wrapper">
                                    <i className="fas fa-lock"></i>
                                    <input  {...register("password")} type={showPassword ? "text" : "password"} id="password" className={`form-control ${errors.password ? 'border-danger' : ''}`} placeholder="At least 8 chars"  />
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
                                {errors.password && <span className="text-danger text-xs mt-1 block">{errors.password.message}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
                                <div className="input-icon-wrapper">
                                    <i className="fas fa-check-double"></i>
                                    <input  {...register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} id="confirm-password" className={`form-control ${errors.confirmPassword ? 'border-danger' : ''}`} placeholder="Repeat password"  />
                                    <button 
                                        type="button" 
                                        className="toggle-password" 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label="Toggle Confirm Password Visibility"
                                        style={{ background: 'none', border: 'none', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                    >
                                        <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="text-danger text-xs mt-1 block">{errors.confirmPassword.message}</span>}
                            </div>
                        </div>

                        {/*<div className="form-group mb-6">
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
                        </div>*/}

                        <button type="submit" className="btn btn-primary w-full btn-lg mb-4" disabled={registerMutation.isPending}>
                            {registerMutation.isPending ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Complete Registration</span>
                                    <i className="fas fa-arrow-right ml-2"></i>
                                </>
                            )}
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
