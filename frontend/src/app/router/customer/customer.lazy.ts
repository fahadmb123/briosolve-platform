import React from 'react';


export const CustomerRegister = React.lazy(() => import('../../../modules/customer/registration/pages/CustomerRegister/CustomerRegister'));
export const CustomerDashboard = React.lazy(() => import('../../../modules/customer/dashboard/pages/Dashboard/Dashboard'));
export const CustomerProfile = React.lazy(() => import('../../../modules/customer/profile/pages/Profile/Profile'));
export const CustomerSettings = React.lazy(() => import('../../../modules/customer/settings/pages/Settings/Settings'));
export const CustomerNotifications = React.lazy(() => import('../../../modules/customer/notifications/pages/Notifications/Notifications'));