import React from 'react';

export const ProviderDashboard = React.lazy(() => import('../../../pages/provider/Dashboard/Dashboard'));
export const ProviderProfile = React.lazy(() => import('../../../pages/provider/Profile/Profile'));
export const ProviderVerification = React.lazy(() => import('../../../pages/provider/Verification/Verification'));
export const ProviderSettings = React.lazy(() => import('../../../pages/provider/Settings/Settings'));
export const ProviderNotifications = React.lazy(() => import('../../../pages/provider/Notifications/Notifications'));