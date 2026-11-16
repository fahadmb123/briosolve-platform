import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordInputType } from '../../schemas/validation';
import { useResetPassword } from '../../hooks/use-otp-varify';
import { PasswordInput } from '../../../../shared/components/ui/PasswordInput/PasswordInput';
import './ResetPassword.css';

export default function ResetPassword() {
  const resetPassword = useResetPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordInputType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange"
  });

  const onSubmit = (data: ResetPasswordInputType) => {
    resetPassword.mutate({ password: data.password });
  };

  return (
    <>
      <div className="login-form-header">
        <h1 className="login-title">New Password</h1>
        <p className="login-subtitle">Choose a strong, unique password</p>
      </div>

      {resetPassword.error?.message ? (
        <div className="login-error-alert" role="alert">
          <i className="fas fa-circle-exclamation login-error-alert-icon"></i>
          <span className="login-error-alert-text">{resetPassword.error.message}</span>
          <button
            type="button"
            className="login-error-alert-close"
            onClick={() => resetPassword.reset()}
            aria-label="Dismiss error"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
        <div className="login-input-group">
          <label className="login-label" htmlFor="new-password">New Password</label>
          <PasswordInput
            id="new-password"
            placeholder="New Password"
            icon=""
            error={errors.password?.message}
            wrapperClassName="login-password-wrapper"
            className="login-input"
            {...register("password")}
          />
        </div>

        <div className="login-input-group">
          <label className="login-label" htmlFor="confirm-new-password">Confirm Password</label>
          <PasswordInput
            id="confirm-new-password"
            placeholder="Confirm Password"
            icon=""
            error={errors.confirmPassword?.message}
            wrapperClassName="login-password-wrapper"
            className="login-input"
            {...register("confirmPassword")}
          />
        </div>

        <button type="submit" disabled={resetPassword.isPending} className="login-submit-btn" style={{ marginTop: '0.4rem' }}>
          {resetPassword.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Updating...</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </button>

        <div className="login-divider-row">
          <span className="login-divider-line"></span>
          <span className="login-divider-text">or</span>
          <span className="login-divider-line"></span>
        </div>

        <div className="login-register-actions" style={{ gridTemplateColumns: '1fr' }}>
          <Link to="/login" className="login-secondary-action-btn">
            Back to Login
          </Link>
        </div>
      </form>
    </>
  );
}
