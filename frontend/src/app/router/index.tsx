import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { LoadingScreen } from '../../shared/components/ui/LoadingScreen/LoadingScreen';

import Home from '../pages/Home/Home';
const Terms = React.lazy(() => import('../pages/Legal/Terms'));
const Privacy = React.lazy(() => import('../pages/Legal/Privacy'));
const LegalLayout = React.lazy(() => import('../../layouts/LegalLayout'));
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



function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname, hash]);

  return null;
}

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
      <ScrollToTop />
      <React.Suspense fallback={<LoadingScreen isLoading={true} />}>
        <ThemeManager />
        <Routes>
         <Route path="/">
          <Route index element={<Home />} />
          <Route element={<LegalLayout />}>
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
          </Route>

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
