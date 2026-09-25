import { Route } from 'react-router-dom';
import { ProviderDashboard, ProviderNotifications, ProviderProfile, ProviderRegister, ProviderSettings, ProviderVerification } from './provider.lazy';



export const providerRoutes = (
  <>
    <Route path="provider/register" element={<ProviderRegister/>} />
    <Route path="dashboard" element={<ProviderDashboard />} />
    <Route path="profile" element={<ProviderProfile />} />
    <Route path="verification" element={<ProviderVerification />} />
    <Route path="settings" element={<ProviderSettings />} />
    <Route path="notifications" element={<ProviderNotifications />} />
  </>
);
