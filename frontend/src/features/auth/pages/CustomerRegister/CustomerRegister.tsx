import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInputType } from '../../schemas/customer/customerRegistration.schema';
import { toast } from 'react-hot-toast';
import { useRegisterCustomer } from '../../hooks/customer/useRegisterCustomer';
import { SpinnerOverlay } from '../../../../shared/components/ui/SpinnerOverlay/SpinnerOverlay';
import { useResetFlowStore } from '../../stores/reset-flow.store';
import { PasswordInput } from '../../../../shared/components/ui/PasswordInput/PasswordInput';
import './CustomerRegister.css';

export default function CustomerRegister() {
  const navigate = useNavigate();
  const setOtpFlowStarted = useResetFlowStore((state) => state.setOtpFlowStarted);
  const registerMutation = useRegisterCustomer();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterInputType>({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  const handleRegister = (data: RegisterInputType) => {
    registerMutation.mutate({
      name: data.name,
      email: data.email,
      password: data.password
    }, {
      onSuccess: (response) => {
        setOtpFlowStarted(true);
        navigate("/otp-verification", { replace: true });
        toast.success(response.message);
      }
    });
  };

  return (
    <>
      {registerMutation.isPending ? <SpinnerOverlay isLoading={true} /> : null}

      <div className="login-form-header">
        <h1 className="login-title">Join as Customer</h1>
        <p className="login-subtitle">Create your account to get started</p>
      </div>

      <form onSubmit={handleSubmit(handleRegister)} className="login-form register-form" noValidate>
        <div className="login-input-group">
          <label className="login-label" htmlFor="name">Full Name</label>
          <div className="login-input-wrapper">
            <input
              type="text"
              id="name"
              className={`login-input ${errors.name ? 'is-invalid' : ''}`}
              placeholder="Full Name"
              {...register("name")}
            />
          </div>
          {errors.name && <div className="login-error-msg">{errors.name.message}</div>}
        </div>

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

        <div className="login-input-group">
          <label className="login-label" htmlFor="confirmPassword">Confirm Password</label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm Password"
            icon=""
            error={errors.confirmPassword?.message}
            wrapperClassName="login-password-wrapper"
            className="login-input"
            {...register("confirmPassword")}
          />
        </div>

        <button type="submit" className="login-submit-btn" disabled={registerMutation.isPending} style={{ marginTop: '0.4rem' }}>
          {registerMutation.isPending ? 'Creating Account...' : 'Register'}
        </button>

        <div className="login-divider-row">
          <span className="login-divider-line"></span>
          <span className="login-divider-text">or</span>
          <span className="login-divider-line"></span>
        </div>

        <div className="login-register-actions">
          <Link to="/login" className="login-secondary-action-btn">
            Sign In
          </Link>
          <Link to="/provider/register" className="login-secondary-action-btn provider">
            Join as a Provider
          </Link>
        </div>
      </form>
    </>
  );
}
