import React from 'react';



export const CustomerDashboard = React.lazy(() => import('../../../pages/customer/Dashboard/Dashboard'));
export const CustomerProfile = React.lazy(() => import('../../../pages/customer/Profile/Profile'));
export const CustomerSettings = React.lazy(() => import('../../../pages/customer/Settings/Settings'));
export const CustomerNotifications = React.lazy(() => import('../../../pages/customer/Notifications/Notifications'));