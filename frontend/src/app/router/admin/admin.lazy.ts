import React from 'react';

export const AdminDashboard = React.lazy(() => import('../../../pages/admin/Dashboard/Dashboard'));
export const AdminCustomers = React.lazy(() => import('../../../pages/admin/Customers/Customers'));
export const AdminCustomerDetails = React.lazy(() => import('../../../pages/admin/CustomerDetails/CustomerDetails'));
export const AdminProviders = React.lazy(() => import('../../../pages/admin/Providers/Providers'));
export const AdminProviderDetails = React.lazy(() => import('../../../pages/admin/ProviderDetails/ProviderDetails'));
export const AdminVerification = React.lazy(() => import('../../../pages/admin/Verification/Verification'));
export const AdminVerificationDetails = React.lazy(() => import('../../../pages/admin/VerificationDetails/VerificationDetails'));
export const AdminSettings = React.lazy(() => import('../../../pages/admin/Settings/Settings'));
export const AdminNotifications = React.lazy(() => import('../../../pages/admin/Notifications/Notifications'));