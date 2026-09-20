import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';

// Phase 1: Public Pages (Placeholders for now)
const Login = React.lazy(() => import('../pages/public/Login/Login'));
const CustomerRegister = React.lazy(() => import('../pages/public/CustomerRegister/CustomerRegister'));
const ProviderRegister = React.lazy(() => import('../pages/public/ProviderRegister/ProviderRegister'));
const ForgotPassword = React.lazy(() => import('../pages/public/ForgotPassword/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/public/ResetPassword/ResetPassword'));
const EmailVerification = React.lazy(() => import('../pages/public/EmailVerification/EmailVerification'));
const Home = React.lazy(() => import('../pages/public/Home/Home'));

// Phase 2: Customer Pages
const CustomerDashboard = React.lazy(() => import('../pages/customer/Dashboard/Dashboard'));
const CustomerProfile = React.lazy(() => import('../pages/customer/Profile/Profile'));
const CustomerSettings = React.lazy(() => import('../pages/customer/Settings/Settings'));
const CustomerNotifications = React.lazy(() => import('../pages/customer/Notifications/Notifications'));

// Phase 3: Provider Pages
const ProviderDashboard = React.lazy(() => import('../pages/provider/Dashboard/Dashboard'));
const ProviderProfile = React.lazy(() => import('../pages/provider/Profile/Profile'));
const ProviderVerification = React.lazy(() => import('../pages/provider/Verification/Verification'));
const ProviderSettings = React.lazy(() => import('../pages/provider/Settings/Settings'));
const ProviderNotifications = React.lazy(() => import('../pages/provider/Notifications/Notifications'));

// Phase 4: Admin Pages
const AdminDashboard = React.lazy(() => import('../pages/admin/Dashboard/Dashboard'));
const AdminUsers = React.lazy(() => import('../pages/admin/Users/Users'));
const AdminUserDetails = React.lazy(() => import('../pages/admin/UserDetails/UserDetails'));
const AdminProviders = React.lazy(() => import('../pages/admin/Providers/Providers'));
const AdminProviderDetails = React.lazy(() => import('../pages/admin/ProviderDetails/ProviderDetails'));
const AdminVerification = React.lazy(() => import('../pages/admin/Verification/Verification'));
const AdminVerificationDetails = React.lazy(() => import('../pages/admin/VerificationDetails/VerificationDetails'));
const AdminSettings = React.lazy(() => import('../pages/admin/Settings/Settings'));
const AdminNotifications = React.lazy(() => import('../pages/admin/Notifications/Notifications'));

// Phase 5: Investigator Pages
const InvestigatorLogin = React.lazy(() => import('../pages/investigator/Login/Login'));
const InvestigatorDashboard = React.lazy(() => import('../pages/investigator/Dashboard/Dashboard'));
const InvestigatorProfile = React.lazy(() => import('../pages/investigator/Profile/Profile'));
const InvestigatorSettings = React.lazy(() => import('../pages/investigator/Settings/Settings'));

function ThemeManager() {
  const location = useLocation();
  useEffect(() => {
    let themeClass = 'theme-user';
    if (location.pathname.startsWith('/admin')) {
      themeClass = 'theme-admin';
    } else if (location.pathname.startsWith('/provider')) {
      themeClass = 'theme-provider';
    }
    document.body.className = themeClass;
  }, [location.pathname]);
  return null;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <ThemeManager />
        <Outlet />
      </React.Suspense>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <CustomerRegister /> },
      { path: 'provider/register', element: <ProviderRegister /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'email-verification', element: <EmailVerification /> },
      
      // Customer Routes
      {
        path: 'customer',
        children: [
          { path: 'dashboard', element: <CustomerDashboard /> },
          { path: 'profile', element: <CustomerProfile /> },
          { path: 'settings', element: <CustomerSettings /> },
          { path: 'notifications', element: <CustomerNotifications /> },
        ]
      },
      
      // Provider Routes
      {
        path: 'provider',
        children: [
          { path: 'dashboard', element: <ProviderDashboard /> },
          { path: 'profile', element: <ProviderProfile /> },
          { path: 'verification', element: <ProviderVerification /> },
          { path: 'settings', element: <ProviderSettings /> },
          { path: 'notifications', element: <ProviderNotifications /> },
        ]
      },

      // Admin Routes
      {
        path: 'admin',
        children: [
          { path: 'dashboard', element: <AdminDashboard /> },
          { path: 'users', element: <AdminUsers /> },
          { path: 'users/:id', element: <AdminUserDetails /> },
          { path: 'providers', element: <AdminProviders /> },
          { path: 'providers/:id', element: <AdminProviderDetails /> },
          { path: 'verification', element: <AdminVerification /> },
          { path: 'verification/:id', element: <AdminVerificationDetails /> },
          { path: 'settings', element: <AdminSettings /> },
          { path: 'notifications', element: <AdminNotifications /> },
        ]
      },

      // Investigator Routes
      {
        path: 'investigator',
        children: [
          { path: 'login', element: <InvestigatorLogin /> },
          { path: 'dashboard', element: <InvestigatorDashboard /> },
          { path: 'profile', element: <InvestigatorProfile /> },
          { path: 'settings', element: <InvestigatorSettings /> },
        ]
      }
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
