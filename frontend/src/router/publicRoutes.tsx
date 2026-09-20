import React from 'react';
import { Route } from 'react-router-dom';

const Login = React.lazy(() => import('../pages/public/Login/Login'));
const CustomerRegister = React.lazy(() => import('../pages/public/CustomerRegister/CustomerRegister'));
const ProviderRegister = React.lazy(() => import('../pages/public/ProviderRegister/ProviderRegister'));
const ForgotPassword = React.lazy(() => import('../pages/public/ForgotPassword/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/public/ResetPassword/ResetPassword'));
const EmailVerification = React.lazy(() => import('../pages/public/EmailVerification/EmailVerification'));

export const publicRoutes = (
  <>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<CustomerRegister />} />
    <Route path="provider/register" element={<ProviderRegister />} />
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="email-verification" element={<EmailVerification />} />
  </>
);
