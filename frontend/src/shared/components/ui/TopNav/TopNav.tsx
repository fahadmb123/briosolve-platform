import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../../features/auth/stores/auth.store";
import { useLogout } from "../../../../features/auth/hooks/use-otp-varify";
import { useTheme } from "../../../hooks/useTheme";
import NotificationDropdown from "../../../../features/notifications/components/NotificationDropdown";
import type { UserRole } from "../../../../features/notifications/types/notification.types";
import "./TopNav.css";

interface SubnavItem {
  label: string;
  to: string;
  icon: string;
}

const CUSTOMER_WORKSPACE_SUBNAV_ITEMS: SubnavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: "fas fa-chart-pie",
  },
  {
    label: "Find Providers",
    to: "/nearby-providers",
    icon: "fas fa-search-location",
  },
  {
    label: "Request Service",
    to: "/request-service",
    icon: "fas fa-plus-circle",
  },
  {
    label: "Notifications",
    to: "/notifications",
    icon: "fas fa-bell",
  },
];

const CUSTOMER_SETTINGS_SUBNAV_ITEMS: SubnavItem[] = [
  {
    label: "Profile",
    to: "/profile",
    icon: "fas fa-user",
  },
  {
    label: "Account Settings",
    to: "/settings",
    icon: "fas fa-cog",
  },
  {
    label: "Notifications",
    to: "/notifications",
    icon: "fas fa-bell",
  },
];

export const TopNav: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logout = useLogout();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLDivElement>(null);

  const isCustomer = isAuthenticated && user?.role === "CUSTOMER";
  const isProvider = isAuthenticated && user?.role === "PROVIDER";
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  const isCustomerSettings =
    isAuthenticated &&
    !isProvider &&
    (location.pathname.startsWith("/settings") ||
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/notifications"));

  const isCustomerWorkspace =
    isAuthenticated &&
    !isProvider &&
    (location.pathname === "/dashboard" ||
      location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/nearby-providers") ||
      location.pathname.startsWith("/request-service"));

  const activeSubnavItems = isCustomerSettings
    ? CUSTOMER_SETTINGS_SUBNAV_ITEMS
    : isCustomerWorkspace
    ? CUSTOMER_WORKSPACE_SUBNAV_ITEMS
    : null;

  const activeSubnavTitle = isCustomerSettings
    ? "Settings"
    : isCustomerWorkspace
    ? "Workspace"
    : "";

  const activeSubnavIcon = isCustomerSettings
    ? "fas fa-sliders-h"
    : "fas fa-th-large";

  const resolvedRole = useMemo<UserRole>(() => {
    if (user?.role === "ADMIN") return "ADMIN";
    if (user?.role === "PROVIDER") return "PROVIDER";
    return "CUSTOMER";
  }, [user?.role]);

  const dashboardRoute = useMemo(() => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "PROVIDER") return "/provider/dashboard";
    return "/dashboard";
  }, [user]);

  const profileRoute = useMemo(() => {
    if (isProvider) return "/provider/profile";
    if (isAdmin) return "/admin/dashboard";
    return "/profile";
  }, [isProvider, isAdmin]);

  const settingsRoute = useMemo(() => {
    if (isProvider) return "/provider/settings";
    if (isAdmin) return "/admin/settings";
    return "/settings";
  }, [isProvider, isAdmin]);

  const notificationRoute = useMemo(() => {
    if (user?.role === "ADMIN") return "/admin/notifications";
    if (user?.role === "PROVIDER") return "/provider/notifications";
    return "/notifications";
  }, [user?.role]);

  const handleLogout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await logout.mutateAsync();
    clearAuth();
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const toggleDropdown = useCallback((name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }, []);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((name: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(name);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const closeAllMenus = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
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
    closeAllMenus();
  }, [location.pathname, closeAllMenus]);

  return (
    <header className={`topnav-header ${activeSubnavItems ? "has-subnav" : ""}`} ref={navRef}>
      <div className="topnav-container">
        <div className="topnav-left">
          <Link to="/" className="topnav-brand" onClick={closeAllMenus}>
            <img src="/briosolve-logo.svg" alt="Briosolve" className="topnav-brand-logo" />
            <img src="/briosolve-text-logo.svg" alt="Briosolve" className="topnav-brand-text-logo" />
          </Link>

          <nav className="topnav-links" aria-label="Primary Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `topnav-link ${isActive ? "active" : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/request-service"
              className={({ isActive }) =>
                `topnav-link ${isActive ? "active" : ""}`
              }
            >
              Request Service
            </NavLink>

            {isCustomer && (
              <NavLink
                to="/nearby-providers"
                className={({ isActive }) =>
                  `topnav-link ${isActive ? "active" : ""}`
                }
              >
                Providers
              </NavLink>
            )}

            {isAuthenticated && (
              <NavLink
                to={dashboardRoute}
                className={({ isActive }) =>
                  `topnav-link ${isActive ? "active" : ""}`
                }
              >
                Dashboard
              </NavLink>
            )}

            {isCustomer && (
              <div
                className="topnav-dropdown-wrapper"
                onMouseEnter={() => handleMouseEnter("more")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className={`topnav-link topnav-dropdown-trigger ${
                    openDropdown === "more" ? "active" : ""
                  }`}
                  onClick={() => toggleDropdown("more")}
                  aria-expanded={openDropdown === "more"}
                >
                  <span>More</span>
                  <i
                    className={`fas fa-chevron-down topnav-caret ${
                      openDropdown === "more" ? "rotate" : ""
                    }`}
                  ></i>
                </button>

                {openDropdown === "more" && (
                  <div className="topnav-dropdown-menu" role="menu">
                    <div className="topnav-dropdown-section-title">Activity</div>
                    <Link
                      to="/request-service"
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>Request Service</span>
                      <i className="fas fa-plus-circle"></i>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>My Requests</span>
                      <i className="fas fa-file-alt"></i>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>Bookings</span>
                      <i className="fas fa-calendar-check"></i>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>Messages</span>
                      <i className="fas fa-comments"></i>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>Reviews</span>
                      <i className="fas fa-star"></i>
                    </Link>

                    <div className="topnav-dropdown-divider"></div>
                    <div className="topnav-dropdown-section-title">Features</div>
                    <Link
                      to="/dashboard"
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>AI Assistant</span>
                      <span className="topnav-mono-badge">AI</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>Products</span>
                      <span className="topnav-mono-badge">NEW</span>
                    </Link>
                    <Link
                      to="/#how-it-works"
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>How It Works</span>
                      <i className="fas fa-info-circle"></i>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        <div className="topnav-right">
          <button
            type="button"
            className="topnav-icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"}></i>
          </button>

          {isAuthenticated ? (
            <>
              <NotificationDropdown
                role={resolvedRole}
                viewAllLink={notificationRoute}
              />

              <div className="topnav-dropdown-wrapper">
                <button
                  type="button"
                  className={`topnav-user-btn ${
                    openDropdown === "account" ? "active" : ""
                  }`}
                  onClick={() => toggleDropdown("account")}
                  aria-expanded={openDropdown === "account"}
                >
                  <span className="topnav-user-avatar">
                    {profile?.profile_image ? (
                      <img
                        src={`${
                          profile.profile_image.startsWith("http")
                            ? ""
                            : import.meta.env.VITE_API_URL || "http://localhost:5000"
                        }${profile.profile_image}`}
                        alt={user?.name || "User"}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.name || "User",
                          )}&background=000&color=fff&rounded=false`;
                        }}
                      />
                    ) : (
                      <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                    )}
                  </span>
                  <span className="topnav-user-name hide-mobile">
                    {user?.name || "Account"}
                  </span>
                  <i
                    className={`fas fa-chevron-down topnav-caret ${
                      openDropdown === "account" ? "rotate" : ""
                    }`}
                  ></i>
                </button>

                {openDropdown === "account" && (
                  <div
                    className="topnav-dropdown-menu topnav-dropdown-menu-right"
                    role="menu"
                  >
                    <div className="topnav-dropdown-header">
                      <div className="topnav-header-title">{user?.name}</div>
                      <div className="topnav-header-sub">{user?.email}</div>
                      {isProvider && (
                        <div style={{ marginTop: "0.35rem" }}>
                          <span className="topnav-mono-badge">Verified Pro</span>
                        </div>
                      )}
                    </div>
                    <Link
                      to={profileRoute}
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>Profile</span>
                      <i className="fas fa-user"></i>
                    </Link>
                    {isProvider && (
                      <Link
                        to="/provider/kyc"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>KYC Verification</span>
                        <i className="fas fa-shield-alt"></i>
                      </Link>
                    )}
                    <NavLink
                      to={notificationRoute}
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>Notifications</span>
                      <i className="fas fa-bell"></i>
                    </NavLink>
                    <Link
                      to={settingsRoute}
                      className="topnav-dropdown-item"
                      role="menuitem"
                      onClick={closeAllMenus}
                    >
                      <span>Settings</span>
                      <i className="fas fa-cog"></i>
                    </Link>
                    {isCustomer && (
                      <Link
                        to="/provider/register"
                        className="topnav-dropdown-item"
                        role="menuitem"
                        onClick={closeAllMenus}
                      >
                        <span>Become a Provider</span>
                        <i className="fas fa-briefcase"></i>
                      </Link>
                    )}
                    <div className="topnav-dropdown-divider"></div>
                    <button
                      type="button"
                      className="topnav-dropdown-item topnav-dropdown-logout"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <span>Log Out</span>
                      <i className="fas fa-sign-out-alt"></i>
                    </button>
                  </div>
                )}
              </div>

              {isCustomer && (
                <Link to="/dashboard" className="topnav-cta-btn hide-mobile">
                  <i className="fas fa-plus"></i>
                  <span>Post Request</span>
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="topnav-text-link">
                Sign In
              </Link>
              <Link to="/register" className="topnav-cta-btn">
                Get Started
              </Link>
            </>
          )}

          <button
            type="button"
            className="topnav-mobile-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
          >
            <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
          </button>
        </div>
      </div>

      {activeSubnavItems && (
        <nav className="topnav-subnav-bar" aria-label="Secondary navigation">
          <div className="topnav-subnav-container">
            <div className="topnav-subnav-left">
              <span className="topnav-subnav-title">
                <i className={activeSubnavIcon}></i>
                <span>{activeSubnavTitle}</span>
              </span>
              <span className="topnav-subnav-separator" aria-hidden="true">/</span>
              {activeSubnavItems.map((item) => {
                const [toPath, toHash] = item.to.split("#");
                const isActive = toHash
                  ? location.pathname === toPath && location.hash === `#${toHash}`
                  : toPath.endsWith("/dashboard")
                  ? location.pathname === toPath && (!location.hash || location.hash === "")
                  : location.pathname === toPath;

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`topnav-subnav-item ${isActive ? "active" : ""}`}
                    onClick={closeAllMenus}
                  >
                    <i className={item.icon}></i>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {mobileMenuOpen && (
        <div className="topnav-mobile-menu">
          <div className="topnav-mobile-section">
            <div className="topnav-mobile-label">Navigation</div>
            <NavLink
              to="/"
              end
              className="topnav-mobile-item"
              onClick={closeAllMenus}
            >
              Home
            </NavLink>

            <NavLink
              to="/request-service"
              className={({ isActive }) =>
                `topnav-link ${isActive ? "active" : ""}`
              }
            >
              Request Service
            </NavLink>
            {isCustomer && (
              <NavLink
                to="/nearby-providers"
                className="topnav-mobile-item"
                onClick={closeAllMenus}
              >
                Providers
              </NavLink>
            )}
            {isAuthenticated && (
              <NavLink
                to={dashboardRoute}
                className="topnav-mobile-item"
                onClick={closeAllMenus}
              >
                Dashboard
              </NavLink>
            )}
          </div>

          {isCustomer && (
            <>
              <div className="topnav-mobile-section">
                <div className="topnav-mobile-label">Activity</div>
                <Link
                  to="/request-service"
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  Request Service
                </Link>
                <Link
                  to="/dashboard"
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  My Requests
                </Link>
                <Link
                  to="/dashboard"
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  Bookings
                </Link>
                <Link
                  to="/dashboard"
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  Messages
                </Link>
                <Link
                  to="/dashboard"
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  Reviews
                </Link>
              </div>

              <div className="topnav-mobile-section">
                <div className="topnav-mobile-label">Features</div>
                <Link
                  to="/dashboard"
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  AI Assistant
                </Link>
                <Link
                  to="/dashboard"
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  Products
                </Link>
                <Link
                  to="/#how-it-works"
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  How It Works
                </Link>
              </div>
            </>
          )}

          <div className="topnav-mobile-section">
            <div className="topnav-mobile-label">Account</div>
            {isAuthenticated ? (
              <>
                <Link
                  to={profileRoute}
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  Profile
                </Link>
                {isProvider && (
                  <Link
                    to="/provider/kyc"
                    className="topnav-mobile-item"
                    onClick={closeAllMenus}
                  >
                    KYC Verification
                  </Link>
                )}
                <Link
                  to={notificationRoute}
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  Notifications
                </Link>
                <Link
                  to={settingsRoute}
                  className="topnav-mobile-item"
                  onClick={closeAllMenus}
                >
                  Settings
                </Link>
                {isCustomer && (
                  <Link
                    to="/provider/register"
                    className="topnav-mobile-item"
                    onClick={closeAllMenus}
                  >
                    Become a Provider
                  </Link>
                )}
                <button
                  type="button"
                  className="topnav-mobile-item topnav-mobile-logout"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="topnav-mobile-item"
                onClick={closeAllMenus}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
