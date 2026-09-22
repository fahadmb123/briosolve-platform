import { Route } from 'react-router-dom';
import { CustomerDashboard, CustomerNotifications, CustomerProfile, CustomerSettings } from './customer.lazy';



export const customerRoutes = (
  <>
    <Route path="dashboard" element={<CustomerDashboard />} />
    <Route path="profile" element={<CustomerProfile />} />
    <Route path="settings" element={<CustomerSettings />} />
    <Route path="notifications" element={<CustomerNotifications />} />
  </>
);
