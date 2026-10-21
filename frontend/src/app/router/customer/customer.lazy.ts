import React from 'react';


export const CustomerRegister = React.lazy(() => import('../../../features/customer/registration/pages/CustomerRegister/CustomerRegister'));
export const CustomerDashboard = React.lazy(() => import('../../../features/customer/dashboard/pages/Dashboard/Dashboard'));
export const CustomerProfile = React.lazy(() => import('../../../features/customer/profile/pages/Profile/Profile'));
export const CustomerSettings = React.lazy(() => import('../../../features/customer/settings/pages/Settings/Settings'));
export const CustomerNotifications = React.lazy(() => import('../../../features/customer/notifications/pages/Notifications/Notifications'));
export const CustomerNearbyProviders = React.lazy(() => import('../../../features/customer/nearbyProviders/pages/NearbyProviders/NearbyProviders'));