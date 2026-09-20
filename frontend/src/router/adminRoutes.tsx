import React from 'react';
import { Route } from 'react-router-dom';

const AdminDashboard = React.lazy(() => import('../pages/admin/Dashboard/Dashboard'));
const AdminUsers = React.lazy(() => import('../pages/admin/Users/Users'));
const AdminUserDetails = React.lazy(() => import('../pages/admin/UserDetails/UserDetails'));
const AdminProviders = React.lazy(() => import('../pages/admin/Providers/Providers'));
const AdminProviderDetails = React.lazy(() => import('../pages/admin/ProviderDetails/ProviderDetails'));
const AdminVerification = React.lazy(() => import('../pages/admin/Verification/Verification'));
const AdminVerificationDetails = React.lazy(() => import('../pages/admin/VerificationDetails/VerificationDetails'));
const AdminSettings = React.lazy(() => import('../pages/admin/Settings/Settings'));
const AdminNotifications = React.lazy(() => import('../pages/admin/Notifications/Notifications'));

export const adminRoutes = (
  <>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="users/:id" element={<AdminUserDetails />} />
    <Route path="providers" element={<AdminProviders />} />
    <Route path="providers/:id" element={<AdminProviderDetails />} />
    <Route path="verification" element={<AdminVerification />} />
    <Route path="verification/:id" element={<AdminVerificationDetails />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="notifications" element={<AdminNotifications />} />
  </>
);
