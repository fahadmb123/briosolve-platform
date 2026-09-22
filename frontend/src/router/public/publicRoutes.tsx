import { Route } from 'react-router-dom';
import { CustomerRegister, EmailVerification, ForgotPassword, Login, ProviderRegister, ResetPassword, OtpVerification } from './public.lazy';




export const publicRoutes = (
  <>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<CustomerRegister />} />
    <Route path="provider/register" element={<ProviderRegister/>} />
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="email-verification" element={<EmailVerification />} />
    <Route path="otp-verification" element={<OtpVerification />} />
  </>
);
