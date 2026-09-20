import React from 'react';
import { Route } from 'react-router-dom';

const ProviderDashboard = React.lazy(() => import('../pages/provider/Dashboard/Dashboard'));
const ProviderProfile = React.lazy(() => import('../pages/provider/Profile/Profile'));
const ProviderVerification = React.lazy(() => import('../pages/provider/Verification/Verification'));
const ProviderSettings = React.lazy(() => import('../pages/provider/Settings/Settings'));
const ProviderNotifications = React.lazy(() => import('../pages/provider/Notifications/Notifications'));

export const providerRoutes = (
  <>
    <Route path="dashboard" element={<ProviderDashboard />} />
    <Route path="profile" element={<ProviderProfile />} />
    <Route path="verification" element={<ProviderVerification />} />
    <Route path="settings" element={<ProviderSettings />} />
    <Route path="notifications" element={<ProviderNotifications />} />
  </>
);
