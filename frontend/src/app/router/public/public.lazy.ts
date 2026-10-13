import React from 'react';

export const Login = React.lazy(() => import('../../../modules/auth/pages/Login/Login'));
export const ForgotPassword = React.lazy(() => import('../../../modules/auth/pages/ForgotPassword/ForgotPassword'));
export const ResetPassword = React.lazy(() => import('../../../modules/auth/pages/ResetPassword/ResetPassword'));
export const EmailVerification = React.lazy(() => import('../../../modules/auth/pages/EmailVerification/EmailVerification'));
export const OtpVerification = React.lazy(() => import('../../../modules/auth/pages/OtpVerification/OtpVerification'));
export const AccountRequest = React.lazy(() => import('../../../modules/auth/pages/AccountRequest/AccountRequest'));