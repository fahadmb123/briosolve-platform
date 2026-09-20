import React from 'react';
import { Route } from 'react-router-dom';

const CustomerDashboard = React.lazy(() => import('../pages/customer/Dashboard/Dashboard'));
const CustomerProfile = React.lazy(() => import('../pages/customer/Profile/Profile'));
const CustomerSettings = React.lazy(() => import('../pages/customer/Settings/Settings'));
const CustomerNotifications = React.lazy(() => import('../pages/customer/Notifications/Notifications'));

export const customerRoutes = (
  <>
    <Route path="dashboard" element={<CustomerDashboard />} />
    <Route path="profile" element={<CustomerProfile />} />
    <Route path="settings" element={<CustomerSettings />} />
    <Route path="notifications" element={<CustomerNotifications />} />
  </>
);
