import React from 'react';

export const AdminDashboard = React.lazy(() => import('../../../modules/admin/dashboard/pages/Dashboard/Dashboard'));
export const AdminCustomers = React.lazy(() => import('../../../modules/admin/customers/pages/Customers/Customers'));
export const AdminProviders = React.lazy(() => import('../../../modules/admin/providers/pages/Providers/Providers'));
export const AdminProviderDetails = React.lazy(() => import('../../../modules/admin/providers/pages/ProviderDetails/ProviderDetails'));
export const AdminVerification = React.lazy(() => import('../../../modules/admin/verification/pages/Verification/Verification'));
export const AdminVerificationDetails = React.lazy(() => import('../../../modules/admin/verification/pages/VerificationDetails/VerificationDetails'));
export const AdminSettings = React.lazy(() => import('../../../modules/admin/settings/pages/Settings/Settings'));
export const AdminNotifications = React.lazy(() => import('../../../modules/admin/notifications/pages/Notifications/Notifications'));
export const AdminCategories = React.lazy(() => import('../../../modules/categories/pages/Categories/Categories'));
export const AdminServices = React.lazy(() => import('../../../modules/services/pages/Services/Services'));
export const AdminReactivations = React.lazy(() => import('../../../modules/reactivations/pages/Reactivations/Reactivations'));