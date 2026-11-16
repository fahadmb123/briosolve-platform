import { useState, useRef, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './LegalPages.css';

interface PillStyle {
  left: number;
  width: number;
  opacity: number;
}

export default function LegalTopBar() {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement | null>(null);
  const [pillStyle, setPillStyle] = useState<PillStyle>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useLayoutEffect(() => {
    let rafId: number | null = null;

    const updatePill = () => {
      if (!navRef.current) return;
      const activeEl = navRef.current.querySelector<HTMLElement>('.legal-topbar-link.active');
      if (activeEl) {
        const navRect = navRef.current.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();
        const targetLeft = elRect.left - navRect.left;
        const targetWidth = elRect.width;

        rafId = requestAnimationFrame(() => {
          setPillStyle({
            left: targetLeft,
            width: targetWidth,
            opacity: 1,
          });
        });
      } else {
        setPillStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updatePill();
    window.addEventListener('resize', updatePill);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', updatePill);
    };
  }, [location.pathname]);

  const isTerms = location.pathname.startsWith('/terms');
  const isPrivacy = location.pathname.startsWith('/privacy');

  return (
    <div className="legal-fixed-topbar">
      <div className="legal-fixed-topbar-inner">
        <div className="legal-topbar-tabs-container">
          <nav className="legal-topbar-links" ref={navRef}>
            <div
              className="legal-topbar-active-pill"
              style={{
                transform: `translateX(${pillStyle.left}px)`,
                width: `${pillStyle.width}px`,
                opacity: pillStyle.opacity,
              }}
            />
            <Link
              to="/terms"
              className={`legal-topbar-link ${isTerms ? 'active' : ''}`}
            >
              <i className="fas fa-file-contract"></i>
              <span>Terms of Service</span>
            </Link>
            <Link
              to="/privacy"
              className={`legal-topbar-link ${isPrivacy ? 'active' : ''}`}
            >
              <i className="fas fa-shield-alt"></i>
              <span>Privacy Policy</span>
            </Link>
          </nav>
        </div>

        <button
          type="button"
          className="legal-topbar-print-btn"
          onClick={() => window.print()}
          title="Print or save as PDF"
          aria-label="Print document"
        >
          <i className="fas fa-print"></i>
          <span>Print</span>
        </button>
      </div>
    </div>
  );
}
