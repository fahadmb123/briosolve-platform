import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';


const AdminLayout = React.lazy(() => import('../layouts/AdminLayout'));
const ProviderLayout = React.lazy(() => import('../layouts/ProviderLayout'));
const InvestigatorLayout = React.lazy(() => import('../layouts/InvestigatorLayout'));
const CustomerLayout = React.lazy(() => import('../layouts/CustomerLayout'));


import { adminRoutes } from './adminRoutes';
import { providerRoutes } from './providerRoutes';
import { investigatorRoutes } from './investigatorRoutes';
import { customerRoutes } from './customerRoutes';
import { publicRoutes } from './publicRoutes';

const Home = React.lazy(() => import('../pages/public/Home/Home'));

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
            
            
            <Route path="customer" element={<CustomerLayout />}>
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
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
