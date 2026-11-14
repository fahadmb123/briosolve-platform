import { Route } from 'react-router-dom';
import React from 'react';
import { EmailVerification, ForgotPassword, Login, ResetPassword, OtpVerification, AccountRequest } from '../lazy/public.lazy';
import { CustomerRegister } from '../lazy/customer.lazy';
import ResetPasswordRoute from '../../../features/auth/guards/ResetPasswordRoute';
import OtpFlowRoute from '../../../features/auth/guards/OtpFlowRoute';

const AuthLayout = React.lazy(() => import('../../../layouts/AuthLayout'));

export const publicRoutes = (
    <>
        <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<CustomerRegister />} />
        </Route>
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="account/request" element={<AccountRequest />} />
        <Route element={<ResetPasswordRoute />}>
            <Route path="reset-password" element={<ResetPassword />} />
        </Route>
    </>
);

export const verificationRoutes = (
    <>
        <Route path="email-verification" element={<EmailVerification />} />
        <Route element={<OtpFlowRoute />}>
            <Route path="otp-verification" element={<OtpVerification />} />
        </Route>
    </>
);
