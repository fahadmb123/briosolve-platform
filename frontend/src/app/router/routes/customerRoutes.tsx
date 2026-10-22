import { Route } from 'react-router-dom';
import { CustomerDashboard, CustomerNotifications, CustomerProfile, CustomerRegister, CustomerSettings, CustomerNearbyProviders } from '../lazy/customer.lazy';
import ProtectedRoute from '../guards/ProtectedRoute';
import RoleRoute from '../guards/RoleRoute';
import PublicRoute from '../guards/PublicRoute';



export const customerRoutes = (
  <>
    <Route element={<PublicRoute/>}>
        <Route path="register" element={<CustomerRegister />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route element={<RoleRoute allowedRoles={["CUSTOMER"]} />}>
        <Route path="settings" element={<CustomerSettings />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="nearby-providers" element={<CustomerNearbyProviders />} />
      </Route>
    </Route>
  </>
);