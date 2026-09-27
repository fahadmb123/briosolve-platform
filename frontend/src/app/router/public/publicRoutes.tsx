import { Route } from 'react-router-dom';
import {  EmailVerification, ForgotPassword, Login, ResetPassword, OtpVerification } from './public.lazy';

import ResetPasswordRoute from '../../../shared/middlewares/ResetPasswordRoute';
import OtpFlowRoute from '../../../shared/middlewares/OtpFlowRoute';



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
        <Route element={<OtpFlowRoute />}>
            <Route path="otp-verification" element={<OtpVerification />} />
        </Route>
    </>
);