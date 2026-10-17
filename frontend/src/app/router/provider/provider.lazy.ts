import React from 'react';


export const ProviderRegister = React.lazy(() => import('../../../features/provider/registration/pages/ProviderRegister/ProviderRegister'));
export const ProviderDashboard = React.lazy(() => import('../../../features/provider/dashboard/pages/Dashboard/Dashboard'));
export const ProviderProfile = React.lazy(() => import('../../../features/provider/profile/pages/Profile/Profile'));
export const ProviderVerification = React.lazy(() => import('../../../features/verification/pages/Verification/Verification'));
export const ProviderKyc = ProviderVerification;
export const ProviderSettings = React.lazy(() => import('../../../features/provider/settings/pages/Settings/Settings'));
export const ProviderNotifications = React.lazy(() => import('../../../features/provider/notifications/pages/Notifications/Notifications'));