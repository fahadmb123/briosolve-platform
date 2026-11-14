import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInputType } from '../../schemas/validation';
import { useLogin } from '../../hooks/use-otp-varify';
import { PasswordInput } from '../../../../shared/components/ui/PasswordInput/PasswordInput';

export default function Login() {
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInputType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange"
  });

  const handleLogin = (data: LoginInputType) => {
    login.mutate(data);
  };

  return (
    <>
      <div className="login-form-header">
        <h1 className="login-title">Hi Customer</h1>
        <p className="login-subtitle">Welcome to Briosolve</p>
      </div>

      {login.error?.message ? (
        <div className="login-error-alert" role="alert">
          <i className="fas fa-circle-exclamation login-error-alert-icon"></i>
          <span className="login-error-alert-text">{login.error.message}</span>
          <button
            type="button"
            className="login-error-alert-close"
            onClick={() => login.reset()}
            aria-label="Dismiss error"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(handleLogin)} className="login-form" noValidate>
        <div className="login-input-group">
          <label className="login-label" htmlFor="email">Email</label>
          <div className="login-input-wrapper">
            <input
              type="email"
              id="email"
              className={`login-input ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Email"
              {...register("email")}
            />
          </div>
          {errors.email && <div className="login-error-msg">{errors.email.message}</div>}
        </div>

        <div className="login-input-group">
          <label className="login-label" htmlFor="password">Password</label>
          <PasswordInput
            id="password"
            placeholder="Password"
            icon=""
            error={errors.password?.message}
            wrapperClassName="login-password-wrapper"
            className="login-input"
            {...register("password")}
          />
        </div>

        <div className="login-forgot-row">
          <Link to="/forgot-password" className="login-forgot-link">Forgot password ?</Link>
        </div>

        <button type="submit" className="login-submit-btn" disabled={login.isPending}>
          {login.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Logging in...</span>
            </>
          ) : (
            <span>Login</span>
          )}
        </button>

        <div className="login-divider-row">
          <span className="login-divider-line"></span>
          <span className="login-divider-text">or</span>
          <span className="login-divider-line"></span>
        </div>

        <div className="login-register-actions">
          <Link to="/register" className="login-secondary-action-btn">
            Register
          </Link>
          <Link to="/provider/register" className="login-secondary-action-btn provider">
            Join as a Provider
          </Link>
        </div>
      </form>
    </>
  );
}
