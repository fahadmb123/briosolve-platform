import React from 'react';
import { Route } from 'react-router-dom';

const InvestigatorLogin = React.lazy(() => import('../pages/investigator/Login/Login'));
const InvestigatorDashboard = React.lazy(() => import('../pages/investigator/Dashboard/Dashboard'));
const InvestigatorProfile = React.lazy(() => import('../pages/investigator/Profile/Profile'));
const InvestigatorSettings = React.lazy(() => import('../pages/investigator/Settings/Settings'));

export const investigatorRoutes = (
  <>
    <Route path="login" element={<InvestigatorLogin />} />
    <Route path="dashboard" element={<InvestigatorDashboard />} />
    <Route path="profile" element={<InvestigatorProfile />} />
    <Route path="settings" element={<InvestigatorSettings />} />
  </>
);
