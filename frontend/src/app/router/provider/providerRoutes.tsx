import { Route, Navigate } from 'react-router-dom';
import { ProviderDashboard, ProviderNotifications, ProviderProfile, ProviderSettings, ProviderVerification } from './provider.lazy';



export const providerRoutes = (
  <>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<ProviderDashboard />} />
    <Route path="profile" element={<ProviderProfile />} />
    <Route path="verification" element={<ProviderVerification />} />
    <Route path="settings" element={<ProviderSettings />} />
    <Route path="notifications" element={<ProviderNotifications />} />
  </>
);
