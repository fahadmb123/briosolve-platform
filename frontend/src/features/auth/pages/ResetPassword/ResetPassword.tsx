import './ResetPassword.css';
import { useTheme } from '../../../../shared/hooks/useTheme';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordInputType } from '../../schemas/validation';
import { useResetPassword } from '../../hooks/use-otp-varify';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { PasswordInput } from '../../../../shared/components/ui/PasswordInput/PasswordInput';

export default function ResetPassword() {
    const {toggleTheme} = useTheme()
    const resetPassword = useResetPassword()

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
                        <Link to="/" className="brand-logo-container justify-center mb-4" aria-label="Briosolve Home">
                            <img src="/briosolve-logo.svg" alt="Briosolve" className="brand-emblem-logo" />
                            <img src="/briosolve-text-logo.svg" alt="Briosolve" className="brand-text-logo" />
                        </Link>
                        
                        <h1 className="h3 mb-2">Create New Password</h1>
                        <p className="text-secondary text-sm">
                            Choose a strong, unique password to secure your marketplace account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group mb-4">
                            <label className="form-label" htmlFor="new-password">New Password</label>
                            <PasswordInput
                                id="new-password"
                                placeholder="At least 6 characters"
                                error={errors.password?.message}
                                {...register("password")}
                            />
                        </div>

                        <div className="form-group mb-6">
                            <label className="form-label" htmlFor="confirm-new-password">Confirm New Password</label>
                            <PasswordInput
                                id="confirm-new-password"
                                icon="fas fa-check-double"
                                placeholder="Repeat your new password"
                                error={errors.confirmPassword?.message}
                                {...register("confirmPassword")}
                            />
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
