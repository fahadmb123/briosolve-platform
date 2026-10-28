import React from 'react';


export const ProviderRegister = React.lazy(() => import('../../../features/auth/pages/ProviderRegister/ProviderRegister'));
export const ProviderDashboard = React.lazy(() => import('../../../features/dashboard/pages/ProviderDashboard/Dashboard'));
export const ProviderProfile = React.lazy(() => import('../../../features/profiles/pages/ProviderProfile/Profile'));
export const ProviderVerification = React.lazy(() => import('../../../features/verification/pages/Verification/Verification'));
export const ProviderKyc = ProviderVerification;
export const ProviderSettings = React.lazy(() => import('../../../features/settings/pages/ProviderSettings/Settings'));
export const ProviderNotifications = React.lazy(() => import('../../../features/notifications/components/NotificationsCenter'));