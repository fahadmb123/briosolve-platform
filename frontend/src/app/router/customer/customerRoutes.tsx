import { Route } from 'react-router-dom';
import {CustomerDashboard,CustomerNotifications,CustomerProfile,CustomerRegister,CustomerSettings} from './customer.lazy';
import ProtectedRoute from '../../../shared/middlewares/ProtectedRoute';
import RoleRoute from '../../../shared/middlewares/RoleRoute';
import PublicRoute from '../../../shared/middlewares/PublicRoute';



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

      </Route>
    </Route>
  </>
);