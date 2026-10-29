import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../../features/auth/stores/auth.store";
import { useLogout } from "../../../../features/auth/hooks/use-otp-varify";
import { useTheme } from "../../../hooks/useTheme";
import type { ProviderProfile } from "../../../types/Dtos";
import NotificationDropdown from "../../../../features/notifications/components/NotificationDropdown";
import "./ProviderTopNav.css";

export const ProviderTopNav: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile) as ProviderProfile | null;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logout = useLogout();

  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await logout.mutateAsync();
    clearAuth();
    setActivePanel(null);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((panelName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActivePanel(panelName);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActivePanel(null);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const togglePanel = useCallback((panelName: string) => {
    setActivePanel((prev) => (prev === panelName ? null : panelName));
  }, []);

  const closeAll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActivePanel(null);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePanel(null);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    closeAll();
  }, [location.pathname, closeAll]);

  return (
    <header className="prov-topnav-header" ref={navRef}>
      <div className="prov-topnav-container">
        <div className="prov-topnav-left">
          <Link
            to="/provider/dashboard"
            className="prov-topnav-brand"
            onClick={closeAll}
          >
            <span className="prov-brand-icon">
              <i className="fas fa-tools"></i>
            </span>
            <span className="prov-brand-text">ReverseMarket</span>
            <span className="prov-pro-badge">PRO</span>
          </Link>
        </div>

        <nav className="prov-topnav-center" aria-label="Provider Categories">
          <div
            className="prov-category-wrapper"
            onMouseEnter={() => handleMouseEnter("workspace")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`prov-category-btn ${
                activePanel === "workspace" ||
                location.pathname === "/provider/dashboard"
                  ? "active"
                  : ""
              }`}
              onClick={() => togglePanel("workspace")}
              aria-expanded={activePanel === "workspace"}
            >
              <span>Workspace</span>
              <i
                className={`fas fa-chevron-down prov-caret ${
                  activePanel === "workspace" ? "rotate" : ""
                }`}
              ></i>
            </button>

            {activePanel === "workspace" && (
              <div className="prov-dropdown-panel" role="menu">
                <div className="prov-panel-grid">
                  <div className="prov-panel-col">
                    <div className="prov-col-title">OVERVIEW & LEADS</div>
                    <NavLink
                      to="/provider/dashboard"
                      end
                      className={({ isActive }) =>
                        `prov-panel-item ${isActive ? "item-active" : ""}`
                      }
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-chart-pie"></i>
                        <span>Dashboard</span>
                      </div>
                    </NavLink>
                    <Link
                      to="#"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-search-dollar"></i>
                        <span>Service Requests</span>
                      </div>
                      <span className="prov-mono-badge">8 New</span>
                    </Link>
                  </div>

                  <div className="prov-panel-col">
                    <div className="prov-col-title">OPERATIONS</div>
                    <Link
                      to="#"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-calendar-check"></i>
                        <span>Bookings</span>
                      </div>
                      <span className="prov-mono-badge">3</span>
                    </Link>
                    <Link
                      to="#"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-comments"></i>
                        <span>Messages</span>
                      </div>
                      <span className="prov-mono-badge">2</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className="prov-category-wrapper"
            onMouseEnter={() => handleMouseEnter("finances")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`prov-category-btn ${
                activePanel === "finances" ? "active" : ""
              }`}
              onClick={() => togglePanel("finances")}
              aria-expanded={activePanel === "finances"}
            >
              <span>Finances</span>
              <i
                className={`fas fa-chevron-down prov-caret ${
                  activePanel === "finances" ? "rotate" : ""
                }`}
              ></i>
            </button>

            {activePanel === "finances" && (
              <div className="prov-dropdown-panel" role="menu">
                <div className="prov-panel-grid">
                  <div className="prov-panel-col">
                    <div className="prov-col-title">QUOTATIONS & BILLING</div>
                    <Link
                      to="#"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-file-invoice-dollar"></i>
                        <span>My Quotations</span>
                      </div>
                      <span className="prov-mono-badge">4</span>
                    </Link>
                    <Link
                      to="#"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-receipt"></i>
                        <span>Invoices & Receipts</span>
                      </div>
                    </Link>
                  </div>

                  <div className="prov-panel-col">
                    <div className="prov-col-title">EARNINGS & RATES</div>
                    <NavLink
                      to="/provider/dashboard"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-wallet"></i>
                        <span>Payout Overview</span>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/provider/settings"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-tags"></i>
                        <span>Service Rates & Radius</span>
                      </div>
                    </NavLink>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className="prov-category-wrapper"
            onMouseEnter={() => handleMouseEnter("performance")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`prov-category-btn ${
                activePanel === "performance" ? "active" : ""
              }`}
              onClick={() => togglePanel("performance")}
              aria-expanded={activePanel === "performance"}
            >
              <span>Performance</span>
              <i
                className={`fas fa-chevron-down prov-caret ${
                  activePanel === "performance" ? "rotate" : ""
                }`}
              ></i>
            </button>

            {activePanel === "performance" && (
              <div className="prov-dropdown-panel" role="menu">
                <div className="prov-panel-grid">
                  <div className="prov-panel-col">
                    <div className="prov-col-title">REPUTATION & FEEDBACK</div>
                    <Link
                      to="#"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-star"></i>
                        <span>Customer Reviews</span>
                      </div>
                    </Link>
                    <NavLink
                      to="/provider/dashboard"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-chart-line"></i>
                        <span>Rating Analytics</span>
                      </div>
                    </NavLink>
                  </div>

                  <div className="prov-panel-col">
                    <div className="prov-col-title">CREDENTIALS</div>
                    <NavLink
                      to="/provider/kyc"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-shield-alt"></i>
                        <span>KYC Verification</span>
                      </div>
                      <span className="prov-mono-badge">
                        <i className="fas fa-check"></i>
                      </span>
                    </NavLink>
                    <NavLink
                      to="/provider/kyc"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-certificate"></i>
                        <span>Verified Pro Status</span>
                      </div>
                    </NavLink>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className="prov-category-wrapper"
            onMouseEnter={() => handleMouseEnter("settings")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={`prov-category-btn ${
                activePanel === "settings" ||
                location.pathname === "/provider/profile" ||
                location.pathname === "/provider/settings" ||
                location.pathname === "/provider/kyc"
                  ? "active"
                  : ""
              }`}
              onClick={() => togglePanel("settings")}
              aria-expanded={activePanel === "settings"}
            >
              <span>Settings</span>
              <i
                className={`fas fa-chevron-down prov-caret ${
                  activePanel === "settings" ? "rotate" : ""
                }`}
              ></i>
            </button>

            {activePanel === "settings" && (
              <div className="prov-dropdown-panel" role="menu">
                <div className="prov-panel-grid">
                  <div className="prov-panel-col">
                    <div className="prov-col-title">PROFESSIONAL IDENTITY</div>
                    <NavLink
                      to="/provider/profile"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-user-tie"></i>
                        <span>Business Profile</span>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/provider/kyc"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-id-card"></i>
                        <span>KYC Documents</span>
                      </div>
                      <span className="prov-mono-badge">
                        <i className="fas fa-check"></i>
                      </span>
                    </NavLink>
                    <Link
                      to="/provider/verification"
                      id="customer-mode-switch"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-exchange-alt"></i>
                        <span>Switch to User</span>
                      </div>
                    </Link>
                  </div>

                  <div className="prov-panel-col">
                    <div className="prov-col-title">PREFERENCES & ACCOUNT</div>
                    <NavLink
                      to="/provider/settings"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-cog"></i>
                        <span>Account Settings</span>
                      </div>
                    </NavLink>
                    <NavLink
                      to="/provider/notifications"
                      className="prov-panel-item"
                      onClick={closeAll}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-bell"></i>
                        <span>Notification Alerts</span>
                      </div>
                    </NavLink>
                    <button
                      type="button"
                      className="prov-panel-item prov-logout-item"
                      onClick={handleLogout}
                    >
                      <div className="prov-item-main">
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Log Out</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="prov-topnav-right">
          <button
            type="button"
            className="prov-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>

          <NotificationDropdown
            role="PROVIDER"
            viewAllLink="/provider/notifications"
          />

          <div className="prov-user-wrapper">
            <button
              type="button"
              className={`prov-user-btn ${
                activePanel === "user" ? "active" : ""
              }`}
              onClick={() => togglePanel("user")}
              aria-expanded={activePanel === "user"}
            >
              <span className="prov-user-avatar">
                <img
                  src={
                    profile?.profile_image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "Provider",
                    )}&background=000&color=fff&rounded=false`
                  }
                  alt={user?.name || "Provider"}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "Provider",
                    )}&background=000&color=fff&rounded=false`;
                  }}
                />
              </span>
              <span className="prov-user-name hide-mobile">
                {user?.name || profile?.business_name || "Provider"}
              </span>
              <i
                className={`fas fa-chevron-down prov-caret ${
                  activePanel === "user" ? "rotate" : ""
                }`}
              ></i>
            </button>

            {activePanel === "user" && (
              <div
                className="prov-dropdown-panel prov-dropdown-panel-right"
                role="menu"
              >
                <div className="prov-user-panel-header">
                  <div className="prov-header-name">
                    {user?.name || profile?.business_name || "Provider"}
                  </div>
                  <div className="prov-header-email">{user?.email}</div>
                  <div className="prov-header-meta">
                    <span className="prov-mono-badge">Verified Pro</span>
                  </div>
                </div>
                <div className="prov-dropdown-divider"></div>
                <NavLink
                  to="/provider/profile"
                  className="prov-panel-item"
                  onClick={closeAll}
                >
                  <div className="prov-item-main">
                    <i className="fas fa-user-tie"></i>
                    <span>Profile</span>
                  </div>
                </NavLink>
                <NavLink
                  to="/provider/kyc"
                  className="prov-panel-item"
                  onClick={closeAll}
                >
                  <div className="prov-item-main">
                    <i className="fas fa-shield-alt"></i>
                    <span>KYC Verification</span>
                  </div>
                </NavLink>
                <NavLink
                  to="/provider/settings"
                  className="prov-panel-item"
                  onClick={closeAll}
                >
                  <div className="prov-item-main">
                    <i className="fas fa-cog"></i>
                    <span>Settings</span>
                  </div>
                </NavLink>
                <Link
                  to="/provider/verification"
                  className="prov-panel-item"
                  onClick={closeAll}
                >
                  <div className="prov-item-main">
                    <i className="fas fa-exchange-alt"></i>
                    <span>Switch to User</span>
                  </div>
                </Link>
                <div className="prov-dropdown-divider"></div>
                <button
                  type="button"
                  className="prov-panel-item prov-logout-item"
                  onClick={handleLogout}
                >
                  <div className="prov-item-main">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Log Out</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="prov-mobile-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
          >
            <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="prov-mobile-menu">
          <div className="prov-mobile-section">
            <div className="prov-col-title">WORKSPACE</div>
            <NavLink
              to="/provider/dashboard"
              end
              className="prov-mobile-item"
              onClick={closeAll}
            >
              <span>Dashboard</span>
            </NavLink>
            <Link to="#" className="prov-mobile-item" onClick={closeAll}>
              <span>Service Requests</span>
              <span className="prov-mono-badge">8 New</span>
            </Link>
            <Link to="#" className="prov-mobile-item" onClick={closeAll}>
              <span>Bookings</span>
              <span className="prov-mono-badge">3</span>
            </Link>
            <Link to="#" className="prov-mobile-item" onClick={closeAll}>
              <span>Messages</span>
              <span className="prov-mono-badge">2</span>
            </Link>
          </div>

          <div className="prov-mobile-section">
            <div className="prov-col-title">FINANCES</div>
            <Link to="#" className="prov-mobile-item" onClick={closeAll}>
              <span>My Quotations</span>
              <span className="prov-mono-badge">4</span>
            </Link>
            <Link to="#" className="prov-mobile-item" onClick={closeAll}>
              <span>Invoices & Receipts</span>
            </Link>
            <NavLink
              to="/provider/dashboard"
              className="prov-mobile-item"
              onClick={closeAll}
            >
              <span>Payout Overview</span>
            </NavLink>
            <NavLink
              to="/provider/settings"
              className="prov-mobile-item"
              onClick={closeAll}
            >
              <span>Service Rates</span>
            </NavLink>
          </div>

          <div className="prov-mobile-section">
            <div className="prov-col-title">PERFORMANCE</div>
            <Link to="#" className="prov-mobile-item" onClick={closeAll}>
              <span>Customer Reviews</span>
            </Link>
            <NavLink
              to="/provider/dashboard"
              className="prov-mobile-item"
              onClick={closeAll}
            >
              <span>Rating Analytics</span>
            </NavLink>
            <NavLink
              to="/provider/kyc"
              className="prov-mobile-item"
              onClick={closeAll}
            >
              <span>KYC Verification</span>
            </NavLink>
          </div>

          <div className="prov-mobile-section">
            <div className="prov-col-title">SETTINGS</div>
            <NavLink
              to="/provider/profile"
              className="prov-mobile-item"
              onClick={closeAll}
            >
              <span>Business Profile</span>
            </NavLink>
            <NavLink
              to="/provider/kyc"
              className="prov-mobile-item"
              onClick={closeAll}
            >
              <span>KYC Documents</span>
            </NavLink>
            <NavLink
              to="/provider/settings"
              className="prov-mobile-item"
              onClick={closeAll}
            >
              <span>Account Settings</span>
            </NavLink>
            <NavLink
              to="/provider/notifications"
              className="prov-mobile-item"
              onClick={closeAll}
            >
              <span>Notifications</span>
            </NavLink>
            <Link
              to="/provider/verification"
              className="prov-mobile-item"
              onClick={closeAll}
            >
              <span>Switch to User</span>
            </Link>
            <button
              type="button"
              className="prov-mobile-item prov-logout-item"
              onClick={handleLogout}
            >
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

