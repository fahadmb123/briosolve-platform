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
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
