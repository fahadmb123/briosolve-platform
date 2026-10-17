import React from 'react';

export const AdminDashboard = React.lazy(() => import('../../../features/admin/dashboard/pages/Dashboard/Dashboard'));
export const AdminCustomers = React.lazy(() => import('../../../features/admin/customers/pages/Customers/Customers'));
export const AdminProviders = React.lazy(() => import('../../../features/admin/providers/pages/Providers/Providers'));
export const AdminProviderDetails = React.lazy(() => import('../../../features/admin/providers/pages/ProviderDetails/ProviderDetails'));
export const AdminVerification = React.lazy(() => import('../../../features/admin/verification/pages/Verification/Verification'));
export const AdminSettings = React.lazy(() => import('../../../features/admin/settings/pages/Settings/Settings'));
export const AdminNotifications = React.lazy(() => import('../../../features/admin/notifications/pages/Notifications/Notifications'));
export const AdminCategories = React.lazy(() => import('../../../features/categories/pages/Categories/Categories'));
export const AdminServices = React.lazy(() => import('../../../features/services/pages/Services/Services'));
export const AdminReactivations = React.lazy(() => import('../../../features/reactivations/pages/Reactivations/Reactivations'));
