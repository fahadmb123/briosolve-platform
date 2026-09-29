import React from 'react';

export const InvestigatorLogin = React.lazy(() => import('../../../modules/investigator/auth/pages/Login/Login'));
export const InvestigatorDashboard = React.lazy(() => import('../../../modules/investigator/dashboard/pages/Dashboard/Dashboard'));
export const InvestigatorProfile = React.lazy(() => import('../../../modules/investigator/profile/pages/Profile/Profile'));
export const InvestigatorSettings = React.lazy(() => import('../../../modules/investigator/settings/pages/Settings/Settings'));