import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import React from 'react';

// Phase 1: Public Pages (Placeholders for now)
const Home = React.lazy(() => import('../pages/public/Home'));
const Login = React.lazy(() => import('../pages/public/Login'));
const CustomerRegister = React.lazy(() => import('../pages/public/CustomerRegister'));
const ProviderRegister = React.lazy(() => import('../pages/public/ProviderRegister'));
const ForgotPassword = React.lazy(() => import('../pages/public/ForgotPassword'));
const ResetPassword = React.lazy(() => import('../pages/public/ResetPassword'));
const EmailVerification = React.lazy(() => import('../pages/public/EmailVerification'));

// Phase 2: Customer Pages
const CustomerDashboard = React.lazy(() => import('../pages/customer/Dashboard'));
const CustomerProfile = React.lazy(() => import('../pages/customer/Profile'));
const CustomerSettings = React.lazy(() => import('../pages/customer/Settings'));
const CustomerNotifications = React.lazy(() => import('../pages/customer/Notifications'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
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
