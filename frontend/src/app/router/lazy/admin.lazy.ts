import React from 'react';

export const AdminDashboard = React.lazy(() => import('../../../features/dashboard/pages/AdminDashboard/Dashboard'));
export const AdminCustomers = React.lazy(() => import('../../../features/profiles/pages/AdminCustomers/Customers'));
export const AdminProviders = React.lazy(() => import('../../../features/profiles/pages/AdminProviders/Providers'));
export const AdminProviderDetails = React.lazy(() => import('../../../features/profiles/pages/AdminProviderDetails/ProviderDetails'));
export const AdminVerification = React.lazy(() => import('../../../features/verification/pages/AdminVerification/AdminVerification'));
export const AdminSettings = React.lazy(() => import('../../../features/settings/pages/AdminSettings/Settings'));
export const AdminNotifications = React.lazy(() => import('../../../features/notifications/components/NotificationsCenter'));
export const AdminCategories = React.lazy(() => import('../../../features/service-catalog/pages/Categories/Categories'));
export const AdminServices = React.lazy(() => import('../../../features/service-catalog/pages/Services/Services'));
export const AdminReactivations = React.lazy(() => import('../../../features/account-reactivation/pages/Reactivations/Reactivations'));
