import './OtpVerification.css';
import { Link, useNavigate} from 'react-router-dom';
import { useTheme } from '../../../../shared/hooks/useTheme';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, type OtpInputType } from '../../schemas/validation';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useGetOtpStatus, useOtpVarify, useResendOtp } from '../../hooks/mutations/use-otp-varify';
import { useResetFlowStore } from '../../../../store/auth/reset-flow.store';
import { useAuthStore } from '../../../../store/auth/auth.store';

export default function OtpVerification() {
    const { toggleTheme } = useTheme()
    const [otp, setOtp] = useState('')
    const [timer, setTimer] = useState(60)
    const [email,setEmail] = useState("")
    const [attempts, setAttempts] = useState(0)
    const navigate = useNavigate()
    const {register,handleSubmit,formState:{errors}} = useForm<OtpInputType>({
        resolver : zodResolver(otpSchema),mode : "onChange"
    })
    const otpVarify = useOtpVarify()
    const getOtpStatus = useGetOtpStatus()
    const resendOtp = useResendOtp()
    const setOtpVerified = useResetFlowStore((state) => state.setOtpVerified);

    const [endTime, setEndTime] = useState<number | null>(null)

    useEffect(() => {
        getOtpStatus.mutate(undefined, {
            onSuccess: (response) => {
                if (response.data.expiresIn === 0) {
                    // If backend says no active OTP session exists, reset flow!
                    useResetFlowStore.getState().setOtpFlowStarted(false);
                    return;
                }
                setEndTime(Date.now() + response.data.expiresIn * 1000)
                setTimer(response.data.expiresIn)
                setAttempts(response.data.attempts)
                setEmail(response.data.email)
            }
        })
    }, [])

    useEffect(() => {
        if (!endTime) return;
        
        const interval = setInterval(() => {
            const now = Date.now()
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
            
            setTimer(remaining)
            
            if (remaining <= 0) {
                clearInterval(interval)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [endTime])

    const handleOtp = (data:OtpInputType) => {
        otpVarify.mutate(data, {
            onSuccess: (response) => {
                if (response.data.path === "reset-password") {
                    setOtpVerified(true);
                }
                
                if (response.data.path === "settings") {
                    const currentUser = useAuthStore.getState().user;
                    if (currentUser && response.data.email) {
                        useAuthStore.getState().setUser({
                            ...currentUser,
                            email: response.data.email,
                            email_verified: true
                        });
                    }
                    navigate(`/${response.data.path}`, { state: { activeView: 'contact' } })
                } else {
                    navigate(`/${response?.data.path}`)
                }

                if (response.data.path === "login" || response.data.path === "settings") toast.success(response.message)
            }
        })
    }

    const handleResend = () => {
        resendOtp.mutate(undefined, {
            onSuccess: (response) => {
                toast.success(response.message)
                setEndTime(Date.now() + response?.data.expiresIn * 1000)
                setTimer(response?.data.expiresIn)
                setAttempts(prev => prev + 1)
            }
        })
    }

    const maskEmail = (emailAddress: string) => {
        if (!emailAddress) return "";
        const [username, domain] = emailAddress.split('@');
        if (!username || !domain) return emailAddress;
        
        if (username.length > 2) {
            return `${username.substring(0, 2)}${'*'.repeat(Math.max(0, username.length - 3))}${username.substring(username.length - 1)}@${domain}`;
        }
        return `${username[0]}*@${domain}`;
    };

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
                        Enter the 6-digit verification code sent to your email or mobile device. to {maskEmail(email)}
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
