import React from 'react';

export const Login = React.lazy(() => import('../../pages/public/Login/Login'));
export const CustomerRegister = React.lazy(() => import('../../pages/public/CustomerRegister/CustomerRegister'));
export const ProviderRegister = React.lazy(() => import('../../pages/public/ProviderRegister/ProviderRegister'));
export const ForgotPassword = React.lazy(() => import('../../pages/public/ForgotPassword/ForgotPassword'));
export const ResetPassword = React.lazy(() => import('../../pages/public/ResetPassword/ResetPassword'));
export const EmailVerification = React.lazy(() => import('../../pages/public/EmailVerification/EmailVerification'));