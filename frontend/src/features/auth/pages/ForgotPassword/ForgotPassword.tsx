import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSchema, type EmailInputType } from '../../schemas/validation';
import { useForm } from 'react-hook-form';
import { useEmailVerify } from '../../hooks/use-otp-varify';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<EmailInputType>({
    resolver: zodResolver(emailSchema),
    mode: "onChange"
  });
  const emailVerify = useEmailVerify();

  const handle = (data: EmailInputType) => {
    emailVerify.mutate(data);
  };

  return (
    <>
      <div className="login-form-header">
        <h1 className="login-title">Reset Password</h1>
        <p className="login-subtitle">Enter your email to receive recovery instructions</p>
      </div>

      <form onSubmit={handleSubmit(handle)} className="login-form" noValidate>
        <div className="login-input-group">
          <label className="login-label" htmlFor="recovery-email">Email</label>
          <div className="login-input-wrapper">
            <input
              {...register("email")}
              type="email"
              id="recovery-email"
              className={`login-input ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Email"
            />
          </div>
          {errors.email && <div className="login-error-msg">{errors.email.message}</div>}
        </div>

        <button type="submit" disabled={emailVerify.isPending} className="login-submit-btn" style={{ marginTop: '0.4rem' }}>
          {emailVerify.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Sending...</span>
            </>
          ) : (
            <span>Send Verification Code</span>
          )}
        </button>

        <div className="login-divider-row">
          <span className="login-divider-line"></span>
          <span className="login-divider-text">or</span>
          <span className="login-divider-line"></span>
        </div>

        <div className="login-register-actions">
          <Link to="/login" className="login-secondary-action-btn">
            Back to Login
          </Link>
          <Link to="/register" className="login-secondary-action-btn">
            Register
          </Link>
        </div>
      </form>
    </>
  );
}
