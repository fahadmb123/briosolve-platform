import './ForgotPassword.css';


import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../shared/hooks/useTheme';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSchema, type EmailInputType } from '../../schemas/validation';
import { useForm } from 'react-hook-form';
import { useEmailVerify } from '../../hooks/mutations/use-otp-varify';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { useResetFlowStore } from '../../../../store/auth/reset-flow.store';

export default function ForgotPassword() {

    const { toggleTheme } = useTheme();
    const navigate = useNavigate();
    const {register,handleSubmit,formState:{errors}} = useForm<EmailInputType>({
        resolver : zodResolver(emailSchema),mode : "onChange"
    })
    const emailVerify = useEmailVerify()
    const setResetFlowStarted = useResetFlowStore((state) => state.setResetFlowStarted);
    const setOtpFlowStarted = useResetFlowStore((state) => state.setOtpFlowStarted);

    const handle = (data:EmailInputType) => {
        emailVerify.mutate(data, {
            onSuccess: (response) => {
                setResetFlowStarted(true);
                setOtpFlowStarted(true);
                navigate("/otp-verification",{replace:true})
                toast.success(response.message)
            }
        });
    };

    return (
        <>
        
        <div className="auth-page-wrapper">
            {emailVerify.isPending ? (<SpinnerOverlay isLoading={true}/>):null }
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
                    
                        <h1 className="h3 mb-2">Password Recovery</h1>
                        <p className="text-secondary text-sm">
                            Enter your verified email address and we'll send a secure password reset link to your inbox.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handle)}>
                        <div className="form-group mb-6">
                            <label className="form-label" htmlFor="recovery-email">Registered Email</label>
                            <div className="input-icon-wrapper">
                                <i className="fas fa-envelope"></i>
                                <input {...register("email")} type="email" id="recovery-email" className={`form-control ${errors.email ? 'is-invalid border-danger' : ''}`} placeholder="name@domain.com" />
                            </div>
                            {errors.email ? (
                                <span className="field-error text-xs text-danger mt-1 block">
                                    {errors.email.message}
                                </span>
                            ) : (
                                <span className="field-hint text-xs text-muted mt-1 block">
                                    We'll never share your email with third parties.
                                </span>
                            )}
                        </div>

                        <button type="submit" disabled={emailVerify.isPending} className="btn btn-primary w-full btn-lg mb-5">
                            <span>{emailVerify.isPending ? "Sending..." : "Send Reset Instructions"}</span>
                            {!emailVerify.isPending && <i className="fas fa-paper-plane ml-1"></i>}
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
