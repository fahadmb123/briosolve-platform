import { Route, Navigate } from 'react-router-dom';
import { ProviderDashboard, ProviderNotifications, ProviderProfile, ProviderSettings, ProviderKyc } from './provider.lazy';

export const providerRoutes = (
  <>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<ProviderDashboard />} />
    <Route path="profile" element={<ProviderProfile />} />
    <Route path="kyc" element={<ProviderKyc />} />
    <Route path="verification" element={<Navigate to="/provider/kyc" replace />} />
    <Route path="settings" element={<ProviderSettings />} />
    <Route path="notifications" element={<ProviderNotifications />} />
  </>
);
