import React from 'react';


export const ProviderRegister = React.lazy(() => import('../../../modules/provider/registration/pages/ProviderRegister/ProviderRegister'));
export const ProviderDashboard = React.lazy(() => import('../../../modules/provider/dashboard/pages/Dashboard/Dashboard'));
export const ProviderProfile = React.lazy(() => import('../../../modules/provider/profile/pages/Profile/Profile'));
export const ProviderVerification = React.lazy(() => import('../../../modules/provider/verification/pages/Verification/Verification'));
export const ProviderSettings = React.lazy(() => import('../../../modules/provider/settings/pages/Settings/Settings'));
export const ProviderNotifications = React.lazy(() => import('../../../modules/provider/notifications/pages/Notifications/Notifications'));