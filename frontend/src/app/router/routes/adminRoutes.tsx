import { Navigate, Route } from 'react-router-dom';
import {
  AdminDashboard,
  AdminNotifications,
  AdminProviderDetails,
  AdminSettings,
  AdminUsers,
  AdminRequests,
  AdminCategories,
  AdminServices,
  AdminServiceRequests
} from '../lazy/admin.lazy';

export const adminRoutes = (
  <>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="customers" element={<Navigate to="/admin/users?tab=customers" replace />} />
    <Route path="providers" element={<Navigate to="/admin/users?tab=providers" replace />} />
    <Route path="providers/:id" element={<AdminProviderDetails />} />
    <Route path="requests" element={<AdminRequests />} />
    <Route path="verification" element={<Navigate to="/admin/requests?tab=verifications" replace />} />
    <Route path="verifications" element={<Navigate to="/admin/requests?tab=verifications" replace />} />
    <Route path="reactivations" element={<Navigate to="/admin/requests?tab=reactivations" replace />} />
    <Route path="service-requests" element={<AdminServiceRequests />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="notifications" element={<AdminNotifications />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="services" element={<AdminServices />} />
  </>
);
