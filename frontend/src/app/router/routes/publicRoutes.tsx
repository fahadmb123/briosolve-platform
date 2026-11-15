import { Route } from 'react-router-dom';
import { EmailVerification, ForgotPassword, Login, ResetPassword, OtpVerification, AccountRequest } from '../lazy/public.lazy';
import { CustomerRegister } from '../lazy/customer.lazy';
import { ProviderRegister } from '../lazy/provider.lazy';
import ResetPasswordRoute from '../../../features/auth/guards/ResetPasswordRoute';
import OtpFlowRoute from '../../../features/auth/guards/OtpFlowRoute';
import AuthLayout from '../../../layouts/AuthLayout';

export const publicRoutes = (
    <>
        <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<CustomerRegister />} />
            <Route path="provider/register" element={<ProviderRegister />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route element={<ResetPasswordRoute />}>
                <Route path="reset-password" element={<ResetPassword />} />
            </Route>
            <Route element={<OtpFlowRoute />}>
                <Route path="otp-verification" element={<OtpVerification />} />
            </Route>
        </Route>
        <Route path="account/request" element={<AccountRequest />} />
    </>
);

export const verificationRoutes = (
    <>
        <Route path="email-verification" element={<EmailVerification />} />
    </>
);
