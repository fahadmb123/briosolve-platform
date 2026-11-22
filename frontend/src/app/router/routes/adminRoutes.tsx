import { Navigate, Route } from 'react-router-dom';
import {
  AdminDashboard,
  AdminNotifications,
  AdminProviderDetails,
  AdminSettings,
  AdminUsers,
  AdminRequests,
  AdminCategories,
  AdminSupport
} from '../lazy/admin.lazy';

export const adminRoutes = (
  <>
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="users" element={<AdminUsers />} />
    <Route path="customers" element={<Navigate to="/admin/users?tab=customers" replace />} />
    <Route path="providers" element={<Navigate to="/admin/users?tab=providers" replace />} />
    <Route path="providers/:id" element={<AdminProviderDetails />} />
    <Route path="requests" element={<AdminRequests />} />
    <Route path="verification" element={<Navigate to="/admin/requests?tab=verifications" replace />} />
    <Route path="verifications" element={<Navigate to="/admin/requests?tab=verifications" replace />} />
    <Route path="reactivations" element={<Navigate to="/admin/requests?tab=reactivations" replace />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="notifications" element={<AdminNotifications />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="services" element={<Navigate to="/admin/categories?tab=services" replace />} />
    <Route path="support" element={<AdminSupport />} />
    <Route path="investigations" element={<Navigate to="/admin/support" replace />} />
  </>
);
