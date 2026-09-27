import { Route } from 'react-router-dom';
import {  EmailVerification, ForgotPassword, Login, ResetPassword, OtpVerification } from './public.lazy';




export const publicRoutes = (
    <>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
    </>
)
export const verificationRoutes = (
    <>
        <Route path="email-verification" element={<EmailVerification />} />
        <Route path="otp-verification" element={<OtpVerification />} />
    </>
);