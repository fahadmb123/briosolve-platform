import React from 'react';


export const CustomerRegister = React.lazy(() => import('../../../features/auth/pages/CustomerRegister/CustomerRegister'));
export const CustomerDashboard = React.lazy(() => import('../../../features/dashboard/pages/CustomerDashboard/Dashboard'));
export const CustomerProfile = React.lazy(() => import('../../../features/profiles/pages/CustomerProfile/Profile'));
export const CustomerSettings = React.lazy(() => import('../../../features/settings/pages/CustomerSettings/Settings'));
export const CustomerNotifications = React.lazy(() => import('../../../features/notifications/pages/NotificationsCenter/NotificationsCenter'));
export const CustomerNearbyProviders = React.lazy(() => import('../../../features/nearby-providers/pages/NearbyProviders/NearbyProviders'));