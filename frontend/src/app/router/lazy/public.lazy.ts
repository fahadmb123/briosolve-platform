import React from 'react';

export const Login = React.lazy(() => import('../../../features/auth/common/pages/Login/Login'));
export const ForgotPassword = React.lazy(() => import('../../../features/auth/common/pages/ForgotPassword/ForgotPassword'));
export const ResetPassword = React.lazy(() => import('../../../features/auth/common/pages/ResetPassword/ResetPassword'));
export const EmailVerification = React.lazy(() => import('../../../features/auth/common/pages/EmailVerification/EmailVerification'));
export const OtpVerification = React.lazy(() => import('../../../features/auth/common/pages/OtpVerification/OtpVerification'));
export const AccountRequest = React.lazy(() => import('../../../features/auth/common/pages/AccountRequest/AccountRequest'));