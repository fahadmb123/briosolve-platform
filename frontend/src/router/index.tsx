import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';

const Home = React.lazy(() => import('../pages/public/Home/Home'));
const NotFound = React.lazy(() => import('../pages/public/NotFound/NotFound'));
const AdminLayout = React.lazy(() => import('../layouts/AdminLayout'));
const ProviderLayout = React.lazy(() => import('../layouts/ProviderLayout'));
const InvestigatorLayout = React.lazy(() => import('../layouts/InvestigatorLayout'));
const CustomerLayout = React.lazy(() => import('../layouts/CustomerLayout'));

import { adminRoutes } from '././admin/adminRoutes';
import { providerRoutes } from './provider/providerRoutes';
import { investigatorRoutes } from './investigator/investigatorRoutes';
import { customerRoutes } from './customer/customerRoutes';
import { publicRoutes } from './public/publicRoutes';



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
      <React.Suspense fallback={<div>Loading...</div>}>
        <ThemeManager />
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            
            
            {publicRoutes}
            
            
            <Route element={<CustomerLayout />}>
              {customerRoutes}
            </Route>
            
            
            <Route path="provider" element={<ProviderLayout />}>
              {providerRoutes}
            </Route>

            
            <Route path="admin" element={<AdminLayout />}>
              {adminRoutes}
            </Route>

            
            <Route path="investigator" element={<InvestigatorLayout />}>
              {investigatorRoutes}
            </Route>

            {/* Fallback for invalid URLs */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
