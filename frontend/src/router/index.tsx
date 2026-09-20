import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';

// Phase 1: Public Pages (Placeholders for now)
const Login = React.lazy(() => import('../pages/public/Login'));
const CustomerRegister = React.lazy(() => import('../pages/public/CustomerRegister'));
const ProviderRegister = React.lazy(() => import('../pages/public/ProviderRegister'));
const ForgotPassword = React.lazy(() => import('../pages/public/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/public/ResetPassword'));
const EmailVerification = React.lazy(() => import('../pages/public/EmailVerification'));

// Phase 2: Customer Pages
const Home = React.lazy(() => import('../pages/customer/Home'));
const CustomerDashboard = React.lazy(() => import('../pages/customer/Dashboard'));
const CustomerProfile = React.lazy(() => import('../pages/customer/Profile'));
const CustomerSettings = React.lazy(() => import('../pages/customer/Settings'));
const CustomerNotifications = React.lazy(() => import('../pages/customer/Notifications'));

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
      }
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
