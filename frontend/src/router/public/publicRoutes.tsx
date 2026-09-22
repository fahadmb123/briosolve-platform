import { Route } from 'react-router-dom';
import Login from '../../pages/investigator/Login/Login';
import CustomerRegister from '../../pages/public/CustomerRegister/CustomerRegister';
import ProviderRegister from '../../pages/public/ProviderRegister/ProviderRegister';
import ForgotPassword from '../../pages/public/ForgotPassword/ForgotPassword';
import ResetPassword from '../../pages/public/ResetPassword/ResetPassword';
import EmailVerification from '../../pages/public/EmailVerification/EmailVerification';



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
