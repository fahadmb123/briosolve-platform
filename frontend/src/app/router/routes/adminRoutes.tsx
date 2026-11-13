import { Navigate, Route } from 'react-router-dom';
import {
  AdminDashboard,
  AdminNotifications,
  AdminProviderDetails,
  AdminSettings,
  AdminUsers,
  AdminVerification,
  AdminCategories,
  AdminServices,
  AdminReactivations,
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
    <Route path="service-requests" element={<AdminServiceRequests />} />
    <Route path="verification" element={<AdminVerification />} />
    <Route path="reactivations" element={<AdminReactivations />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="notifications" element={<AdminNotifications />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="services" element={<AdminServices />} />
  </>
);
