import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { LoadingScreen } from '../../shared/components/ui/LoadingScreen/LoadingScreen';

const Home = React.lazy(() => import('../pages/Home/Home'));
const NotFound = React.lazy(() => import('../pages/NotFound/NotFound'));
const AdminLayout = React.lazy(() => import('../../layouts/AdminLayout'));
const ProviderLayout = React.lazy(() => import('../../layouts/ProviderLayout'));
const CustomerLayout = React.lazy(() => import('../../layouts/CustomerLayout'));

import { adminRoutes } from './admin/adminRoutes';
import { providerRoutes } from './provider/providerRoutes';
import { customerRoutes } from './customer/customerRoutes';
import { publicRoutes, verificationRoutes } from './public/publicRoutes';
import PublicRoute from '../../shared/middlewares/PublicRoute';
import RoleRoute from '../../shared/middlewares/RoleRoute';
import { ProviderRegister } from './provider/provider.lazy';



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
              <Route path="provider/register" element={<ProviderRegister />} />
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
