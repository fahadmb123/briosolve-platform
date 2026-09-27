import { Route } from 'react-router-dom';
import {  EmailVerification, ForgotPassword, Login, ResetPassword, OtpVerification } from './public.lazy';
import ResetFlowRoute from '../../../shared/middlewares/ResetFlowRoute';
import ResetPasswordRoute from '../../../shared/middlewares/ResetPasswordRoute';




export const publicRoutes = (
    <>
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route element={<ResetPasswordRoute />}>
            <Route path="reset-password" element={<ResetPassword />} />
        </Route>
    </>
)
export const verificationRoutes = (
    <>
        <Route path="email-verification" element={<EmailVerification />} />
        <Route element={<ResetFlowRoute />}>
            <Route path="otp-verification" element={<OtpVerification />} />
        </Route>
    </>
);