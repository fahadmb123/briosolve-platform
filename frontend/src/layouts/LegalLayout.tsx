import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { CustomerNavbar } from '../shared/components/ui/TopNav/TopNav';
import LegalTopBar from '../app/pages/Legal/LegalTopBar';
import '../app/pages/Legal/LegalPages.css';

export default function LegalLayout() {
  const location = useLocation();
  const isTerms = location.pathname.startsWith('/terms');
  const isPrivacy = location.pathname.startsWith('/privacy');

  return (
    <div className="legal-page-wrapper">
      <CustomerNavbar />
      <LegalTopBar />
      <main className="legal-main">
        <React.Suspense fallback={null}>
          <Outlet />
        </React.Suspense>
      </main>
      <footer className="legal-footer">
        <div className="legal-footer-container">
          <div className="legal-footer-copy">
            &copy; {new Date().getFullYear()} Briosolve. All rights reserved.
          </div>
          <div className="legal-footer-links">
            <Link to="/terms" className={isTerms ? 'active' : ''}>Terms of Service</Link>
            <Link to="/privacy" className={isPrivacy ? 'active' : ''}>Privacy Policy</Link>
            <Link to="/">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
