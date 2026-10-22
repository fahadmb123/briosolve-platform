import { Route } from 'react-router-dom';
import { EmailVerification, ForgotPassword, Login, ResetPassword, OtpVerification, AccountRequest } from '../lazy/public.lazy';

import ResetPasswordRoute from '../../../features/auth/guards/ResetPasswordRoute';
import OtpFlowRoute from '../../../features/auth/guards/OtpFlowRoute';



export const publicRoutes = (
    <>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="account/request" element={<AccountRequest />} />
        <Route element={<ResetPasswordRoute />}>
            <Route path="reset-password" element={<ResetPassword />} />
        </Route>
    </>
)
export const verificationRoutes = (
    <>
        <Route path="email-verification" element={<EmailVerification />} />
        <Route element={<OtpFlowRoute />}>
            <Route path="otp-verification" element={<OtpVerification />} />
        </Route>
        
    </>
);