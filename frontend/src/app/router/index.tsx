import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { LoadingScreen } from '../../shared/components/ui/LoadingScreen/LoadingScreen';

import Home from '../pages/Home/Home';
const NotFound = React.lazy(() => import('../pages/NotFound/NotFound'));
const AdminLayout = React.lazy(() => import('../../layouts/AdminLayout'));
const ProviderLayout = React.lazy(() => import('../../layouts/ProviderLayout'));
const CustomerLayout = React.lazy(() => import('../../layouts/CustomerLayout'));

import { adminRoutes } from './routes/adminRoutes';
import { providerRoutes } from './routes/providerRoutes';
import { customerRoutes } from './routes/customerRoutes';
import { publicRoutes, verificationRoutes } from './routes/publicRoutes';
import PublicRoute from './guards/PublicRoute';
import RoleRoute from './guards/RoleRoute';



function ThemeManager() {
  const location = useLocation();
  useEffect(() => {
    const themeClasses = ['theme-user', 'theme-admin', 'theme-provider'];
    let targetClass = 'theme-user';
    if (location.pathname.startsWith('/admin')) {
      targetClass = 'theme-admin';
    } else if (location.pathname.startsWith('/provider')) {
      targetClass = 'theme-provider';
    }
    themeClasses.forEach((cls) => {
      if (cls === targetClass) {
        document.body.classList.add(cls);
      } else {
        document.body.classList.remove(cls);
      }
    });
  }, [location.pathname]);
  return null;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<LoadingScreen isLoading={true} />}>
        <ThemeManager />
        <Routes>
         <Route path="/">
          <Route index element={<Home />} />

          <Route element={<PublicRoute />}>
              {publicRoutes}
          </Route>

          {verificationRoutes}

          <Route element={<CustomerLayout />}>
              {customerRoutes}
          </Route>

          <Route path="provider" element={<ProviderLayout />}>
              {providerRoutes}
          </Route>

          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route path="admin" element={<AdminLayout />}>
                  {adminRoutes}
              </Route>
          </Route>



          <Route path="*" element={<NotFound />} />
      </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
