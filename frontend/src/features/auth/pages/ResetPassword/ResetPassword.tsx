import { useState } from 'react';
import './ResetPassword.css';
import { useTheme } from '../../../../shared/hooks/useTheme';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordInputType } from '../../schemas/validation';
import { useResetPassword } from '../../hooks/use-otp-varify';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';

export default function ResetPassword() {
    const {toggleTheme} = useTheme()
    const resetPassword = useResetPassword()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInputType>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange"
    });

    const onSubmit = (data: ResetPasswordInputType) => {
        resetPassword.mutate({password:data.password});
    }

    return (
        <>
        
        <div className="auth-page-wrapper">
            
            <button onClick={toggleTheme} id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
                <i className="fas fa-sun"></i>
            </button>
            {resetPassword.isPending ? (<SpinnerOverlay isLoading={true}/>):null }
            <div className="auth-card-container">
                <div className="auth-card card">
                    <div className="text-center mb-6">
                        <Link to="/" className="logo justify-center mb-4">
                            <i className="fas fa-layer-group text-primary"></i>
                            <span>ReverseMarket</span>
                        </Link>
                        
                        <h1 className="h3 mb-2">Create New Password</h1>
                        <p className="text-secondary text-sm">
                            Choose a strong, unique password to secure your marketplace account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="new-password">New Password</label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-lock"></i>
                                <input {...register("password")} type={showPassword ? "text" : "password"} id="new-password" className={`form-control ${errors.password ? 'is-invalid border-danger' : ''}`} placeholder="At least 6 characters" />
                                <button 
                                    type="button" 
                                    className="toggle-password" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle Password Visibility"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {errors.password && (
                                <span className="field-error text-xs text-danger mt-1 block">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <div className="form-group mb-6">
                            <label className="form-label" htmlFor="confirm-new-password">Confirm New Password</label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-check-double"></i>
                                <input {...register("confirmPassword")} type={showConfirmPassword ? "text" : "password"} id="confirm-new-password" className={`form-control ${errors.confirmPassword ? 'is-invalid border-danger' : ''}`} placeholder="Repeat your new password" />
                                <button 
                                    type="button" 
                                    className="toggle-password" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label="Toggle Confirm Password Visibility"
                                >
                                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <span className="field-error text-xs text-danger mt-1 block">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary w-full btn-lg mb-5">
                            <span>Reset Password</span>
                            <i className="fas fa-arrow-right ml-1"></i>
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
