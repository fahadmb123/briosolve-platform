import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, type OtpInputType } from '../../schemas/validation';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useGetOtpStatus, useOtpVarify, useResendOtp } from '../../hooks/use-otp-varify';
import { useResetFlowStore } from '../../stores/reset-flow.store';
import { useAuthStore } from '../../stores/auth.store';
import { maskEmail, maskPhoneNumber } from '../../../../shared/utils/masking';
import './OtpVerification.css';

interface OtpVerificationProps {
  isInline?: boolean;
  onInlineSuccess?: () => void;
}

export default function OtpVerification({ isInline, onInlineSuccess }: OtpVerificationProps = {}) {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [email, setEmail] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [forTo, setForTo] = useState('');
  const [phone, setPhone] = useState('');
  const currentUser = useAuthStore((state) => state.user);
  const backDestination = currentUser?.role === "PROVIDER" 
    ? "/provider/settings" 
    : currentUser?.role === "CUSTOMER" 
      ? "/settings" 
      : "/login";

  const { register, handleSubmit, formState: { errors } } = useForm<OtpInputType>({
    resolver: zodResolver(otpSchema),
    mode: "onChange"
  });

  const otpVarify = useOtpVarify(isInline);
  const getOtpStatus = useGetOtpStatus();
  const resendOtp = useResendOtp();
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    getOtpStatus.mutate(undefined, {
      onSuccess: (response) => {
        if (response.data.expiresIn === 0) {
          useResetFlowStore.getState().setOtpFlowStarted(false);
          return;
        }
        setEndTime(Date.now() + response.data.expiresIn * 1000);
        setTimer(response.data.expiresIn);
        setAttempts(response.data.attempts);
        setEmail(response.data.email);
        setForTo(response.data.for);
        setPhone(response.data.phone as string);
      }
    });
  }, []);

  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimer(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const handleOtp = (data: OtpInputType) => {
    otpVarify.mutate(data, {
      onSuccess: () => {
        if (isInline && onInlineSuccess) {
          onInlineSuccess();
        }
      }
    });
  };

  const handleResend = () => {
    resendOtp.mutate(undefined, {
      onSuccess: (response) => {
        toast.success(response.message);
        setEndTime(Date.now() + response?.data.expiresIn * 1000);
        setTimer(response?.data.expiresIn);
        setAttempts(prev => prev + 1);
      }
    });
  };

  if (isInline) {
    return (
      <div className="auth-card otp-card text-center w-full">
        <h1 className="h3 mb-2">Two-Step Verification</h1>
        <p className="text-secondary text-sm mb-6">
          Enter the 6-digit verification code sent to your {forTo === 'UPDATE_PHONE' ? 'mobile device' : 'email'} to{' '}
          <span className="font-medium">
            {forTo === 'UPDATE_PHONE' ? maskPhoneNumber(phone) : maskEmail(email)}
          </span>
        </p>

        <div onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(handleOtp)();
          }
        }}>
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

          <button 
            type="button" 
            onClick={handleSubmit(handleOtp)} 
            className="btn btn-primary w-full btn-lg mb-5" 
            disabled={otp.length !== 6 || otpVarify.isPending}
          >
            {otpVarify.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Account</span>
                <i className="fas fa-check-circle ml-2"></i>
              </>
            )}
          </button>
        </div>

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
            {resendOtp.isPending ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                <span>Resending...</span>
              </>
            ) : (
              <>
                <i className="fas fa-redo-alt mr-1"></i>
                <span>Resend OTP</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="login-form-header">
        <h1 className="login-title">Verify Code</h1>
        <p className="login-subtitle">
          Code sent to {forTo === 'UPDATE_PHONE' ? maskPhoneNumber(phone) : maskEmail(email)}
        </p>
      </div>

      <div onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit(handleOtp)();
        }
      }}>
        <div className="login-input-group">
          <input
            {...register("otp", {
              onChange: (e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))
            })}
            type="text"
            className={`login-input ${errors.otp ? 'is-invalid' : ''}`}
            style={{ letterSpacing: '0.45em', fontSize: '1.4rem', fontWeight: '700', textAlign: 'center' }}
            maxLength={6}
            placeholder="------"
            value={otp}
            required
          />
          {errors.otp && <div className="login-error-msg">{errors.otp.message}</div>}
        </div>

        <button 
          type="button" 
          onClick={handleSubmit(handleOtp)} 
          className="login-submit-btn" 
          disabled={otp.length !== 6 || otpVarify.isPending}
          style={{ marginTop: '0.4rem' }}
        >
          {otpVarify.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Code</span>
          )}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
        <p className="login-subtitle" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          {timer > 0 ? `Resend code in ${timer}s` : (attempts >= 5 ? "Maximum attempts reached" : "Didn't receive code?")}
        </p>
        <button 
          type="button" 
          className="login-secondary-action-btn"
          style={{ width: '100%', gap: '0.5rem' }}
          disabled={timer > 0 || attempts >= 5 || resendOtp.isPending}
          onClick={handleResend}
        >
          {resendOtp.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Resending...</span>
            </>
          ) : (
            <>
              <i className="fas fa-redo-alt"></i>
              <span>Resend OTP</span>
            </>
          )}
        </button>
      </div>

      <div className="login-divider-row">
        <span className="login-divider-line"></span>
        <span className="login-divider-text">or</span>
        <span className="login-divider-line"></span>
      </div>

      <div className="login-register-actions" style={{ gridTemplateColumns: '1fr' }}>
        <Link to={backDestination} className="login-secondary-action-btn">
          Back
        </Link>
      </div>
    </>
  );
}
