import { Navigate, Route } from 'react-router-dom';
import { AdminDashboard, AdminNotifications, AdminProviderDetails, AdminProviders, AdminSettings, AdminCustomers, AdminVerification, AdminVerificationDetails, AdminCategories, AdminServices } from './admin.lazy';

export const adminRoutes = (
  <>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="customers" element={<AdminCustomers />} />
    <Route path="providers" element={<AdminProviders />} />
    <Route path="providers/:id" element={<AdminProviderDetails />} />
    <Route path="verification" element={<AdminVerification />} />
    <Route path="verification/:id" element={<AdminVerificationDetails />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="notifications" element={<AdminNotifications />} />
    <Route path="categories" element={<AdminCategories />} />
    <Route path="services" element={<AdminServices />} />
  </>
);
