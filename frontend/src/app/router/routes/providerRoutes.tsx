import { Route, Navigate } from 'react-router-dom';
import { ProviderDashboard, ProviderNotifications, ProviderProfile, ProviderSettings, ProviderKyc } from '../lazy/provider.lazy';
import ProtectedRoute from '../guards/ProtectedRoute';
import RoleRoute from '../guards/RoleRoute';

export const providerRoutes = (
  <>
  <Route element={<ProtectedRoute />}>
    <Route  element={<RoleRoute allowedRoles={["PROVIDER"]} />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<ProviderDashboard />} />
      <Route path="profile" element={<ProviderProfile />} />
      <Route path="kyc" element={<ProviderKyc />} />
      <Route path="verification" element={<Navigate to="/provider/kyc" replace />} />
      <Route path="settings" element={<ProviderSettings />} />
      <Route path="notifications" element={<ProviderNotifications />} />
    </Route>
  </Route>
  </>
);
