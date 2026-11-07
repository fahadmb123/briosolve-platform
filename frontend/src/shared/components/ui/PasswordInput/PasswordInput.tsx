import React, { useState, forwardRef } from 'react';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: string;
  wrapperClassName?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({
  error,
  icon = "fas fa-lock",
  className = "",
  wrapperClassName = "",
  placeholder = "••••••••",
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`password-input-wrapper w-full ${wrapperClassName}`}>
      <div className={`${icon ? 'input-icon-wrapper' : 'relative'} flex items-center w-full`}>
        {icon && <i className={icon}></i>}
        <input
          {...props}
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={`form-control ${!icon ? 'pr-10' : ''} ${error ? 'border-danger is-invalid' : ''} ${className}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        </button>
      </div>
      {error && <span className="text-danger text-xs mt-1 block">{error}</span>}
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
