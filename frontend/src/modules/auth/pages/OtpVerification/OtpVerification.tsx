import './OtpVerification.css';
import { Link, useNavigate} from 'react-router-dom';
import { useTheme } from '../../../../shared/hooks/useTheme';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, type OtpInputType } from '../../schemas/validation';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useGetOtpStatus, useOtpVarify, useResendOtp } from '../../hooks/mutations/use-otp-varify';
import { useResetFlowStore } from '../../../../store/auth/reset-flow.store';

export default function OtpVerification() {
    const { toggleTheme } = useTheme()
    const [otp, setOtp] = useState('')
    const [timer, setTimer] = useState(60)
    const [attempts, setAttempts] = useState(0)
    const navigate = useNavigate()
    const {register,handleSubmit,formState:{errors}} = useForm<OtpInputType>({
        resolver : zodResolver(otpSchema),mode : "onChange"
    })
    const otpVarify = useOtpVarify()
    const getOtpStatus = useGetOtpStatus()
    const resendOtp = useResendOtp()
    const setOtpVerified = useResetFlowStore((state) => state.setOtpVerified);

    useEffect(() => {
        const getStatus = async () => {
            try {
                const response = await getOtpStatus.mutateAsync()
                setTimer(response.data.expiresIn)
                setAttempts(response.data.attempts)
            } catch (err) {
                if (isAxiosError(err) && err.response?.data?.message) {
                    toast.error(err.response.data.message);
                } else if (err instanceof Error) {
                    toast.error(err.message);
                } else {
                    toast.error("An unexpected error occurred");
                }
            }
        }

        getStatus()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [timer])

    const handleOtp = async (data:OtpInputType) => {
        try {
            const response = await otpVarify.mutateAsync(data)
            if (response.data.path === "reset-password") {
                setOtpVerified(true);
            }
            navigate(`/${response?.data.path}`)
            if (response.data.path === "login") toast.success(response.message)
        } catch (err) {
            if (isAxiosError(err) && err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    }

    const handleResend = async () => {
        try {
            const response = await resendOtp.mutateAsync()
            toast.success(response.message)
            setTimer(response?.data.expiresIn)
            setAttempts(prev => prev + 1)
        } catch (err) {
            if (isAxiosError(err) && err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    }

    return (
        <div className="auth-page-wrapper">
            <button onClick={toggleTheme} id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
                <i className="fas fa-sun"></i>
            </button>
            
            <div className="auth-card-container">
                <div className="auth-card otp-card text-center">
                    <Link to="/" className="logo justify-center mb-5">
                        <i className="fas fa-layer-group text-primary"></i>
                        <span>ReverseMarket</span>
                    </Link>

                   

                    <h1 className="h3 mb-2">Two-Step Verification</h1>
                    <p className="text-secondary text-sm mb-6">
                        Enter the 6-digit verification code sent to your email or mobile device.
                    </p>

                    <form onSubmit={handleSubmit(handleOtp)}>
                        <div className="form-group mb-6">
                            <input
                                {...register("otp", {
                                    onChange: (e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))
                                })}
                                type="text"
                                className={`otp-single-input form-control text-center mx-auto ${errors.otp ? 'border-danger' : ''}`}
                                maxLength={6}
                                placeholder="------"
                                value={otp}
                                required
                            />
                            {errors.otp && <div className="text-danger text-xs mt-2">{errors.otp.message}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary w-full btn-lg mb-5" disabled={otp.length !== 6}>
                            <span>Verify Account</span>
                            <i className="fas fa-check-circle ml-2"></i>
                        </button>
                    </form>

                    <div className="text-center text-sm">
                        <p className="text-secondary mb-2">
                            {timer > 0 ? `Resend code in ${timer}s` : (attempts >= 5 ? "Maximum attempts reached" : "Didn't receive the code?")}
                        </p>
                        <button 
                            type="button" 
                            className="btn btn-outline w-full mb-5" 
                            disabled={timer > 0 || attempts >= 5 || resendOtp.isPending}
                            onClick={handleResend}
                        >
                            <i className="fas fa-redo-alt mr-1"></i> {resendOtp.isPending ? "Resending..." : "Resend OTP"}
                        </button>
                    </div>

                    <div className="text-center text-sm border-top pt-5">
                        <Link to="/login" className="back-link">
                            <i className="fas fa-arrow-left mr-1"></i> Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
