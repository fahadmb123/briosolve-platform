import { Route } from 'react-router-dom';
import { InvestigatorDashboard, InvestigatorLogin, InvestigatorProfile, InvestigatorSettings } from './investigator.lazy';



export const investigatorRoutes = (
  <>
    <Route path="login" element={<InvestigatorLogin />} />
    <Route path="dashboard" element={<InvestigatorDashboard />} />
    <Route path="profile" element={<InvestigatorProfile />} />
    <Route path="settings" element={<InvestigatorSettings />} />
  </>
);
